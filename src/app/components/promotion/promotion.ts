// src/app/pages/promotions/promotions.component.ts
import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { PromotionService } from '../../services/promotion';
import { Promotion } from '../../interface/promotion';

import { HomeService } from '../../services/home';

// ✅ récupère l’utilisateur connecté (et donc son boutiqueId)
import { AuthService } from '../../services/auth.service';

import { HeaderBoutiqueComponent } from '../header-boutique/header-boutique';
import { Footer } from '../footer/footer';
import { PaginationComponent } from '../../components/pagination/pagination';

import { ProduitService } from '../../services/produit';
import { HeaderBoutique } from "../header-boutique/header-boutique";

type PromotionScope = 'ALL_PRODUCTS' | 'PRODUCTS';

type EvenementLite = {
  _id: string;
  titre: string;
  dateDebut: string | Date;
  dateFin: string | Date;
};

type ProduitLite = {
  _id: string;
  nom: string;
  prix?: number;
};

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    HeaderBoutiqueComponent,
    Footer,
    PaginationComponent,
    HeaderBoutique
],
  templateUrl: './promotion.html',
  styleUrls: ['./promotion.css'],
})
export class PromotionComponent implements OnInit, OnDestroy {
  promotions: Promotion[] = [];

  isLoading = false;
  isSaving = false;
  errorMessage = '';

  // ✅ boutiqueId depuis l'utilisateur connecté
  boutiqueId = '';

  // Filtres UI (HTML)
  filters: { search: string; actif: '' | 'true'; scope: '' | PromotionScope } = {
    search: '',
    actif: '',
    scope: '',
  };

  // Pagination (HTML)
  page = 1;
  limit = 12;
  totalPages = 1;
  totalItems = 0;

  // Delete confirm (HTML)
  showDeleteConfirm = false;
  promoToDelete: Promotion | null = null;

  // Modal add/edit
  showModal = false;
  isEditMode = false;
  currentPromo: Promotion | null = null;

  // ✅ Event dropdown (événements en cours)
  evenementsActifs: EvenementLite[] = [];

  // ✅ Produits picker
  showProductsPicker = false;
  productsSearch = '';
  products: ProduitLite[] = [];
  productsPage = 1;
  productsLimit = 10;
  productsTotalPages = 1;
  productsTotalItems = 0;

  // ✅ Selected products (chips)
  selectedProducts: ProduitLite[] = [];

  // ✅ Form model (PLUS BESOIN de choisir boutique)
  promoForm: {
    event: string | null;
    titre: string;
    description: string;
    pourcentage: number | null;
    dateDebut: string; // yyyy-mm-dd
    dateFin: string; // yyyy-mm-dd
    scope: PromotionScope;
    productIds: string[];
  } = this.emptyForm();

  private destroy$ = new Subject<void>();

  constructor(
    private promoApi: PromotionService,
    private homeApi: HomeService,
    private produitApi: ProduitService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    this.boutiqueId = user?.boutiqueId || '';

    this.loadPromotions();
    this.loadEvenementsActifs();
  }

  // =========================
  // LOAD PROMOTIONS / FILTER / PAGE
  // =========================
  loadPromotions(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const query: any = {
      page: this.page,
      limit: this.limit,
    };

    if (this.filters.search?.trim()) query.search = this.filters.search.trim();
    if (this.filters.scope) query.scope = this.filters.scope;
    if (this.filters.actif) query.actif = this.filters.actif;

    // ✅ si ton backend filtre par boutique côté token, rien à faire.
    // ✅ sinon, tu peux décommenter la ligne suivante si ton API accepte boutiqueId en query
    // if (this.boutiqueId) query.boutique = this.boutiqueId;

    const obs =
      this.filters.actif === 'true'
        ? this.promoApi.getPromotionsActives(query)
        : this.promoApi.getAllPromotions(query);

    obs.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.promotions = res?.data || [];
        this.totalItems = res?.totalItems ?? this.promotions.length;
        this.totalPages = res?.totalPages ?? 1;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.errorMessage = err?.error?.message || err?.message || 'Erreur chargement promotions';
        this.isLoading = false;
      },
    });
  }

  applyFilters(): void {
    this.page = 1;
    this.loadPromotions();
  }

  onPageChange(p: number): void {
    this.page = p;
    this.loadPromotions();
  }

  // =========================
  // LOAD EVENEMENTS ACTIFS (pour select)
  // =========================
  loadEvenementsActifs(): void {
    this.homeApi
      .getEvenementsActifs()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.evenementsActifs = (res?.data || []) as EvenementLite[];
        },
        error: () => {
          this.evenementsActifs = [];
        },
      });
  }

  // =========================
  // STATUS HELPERS (HTML)
  // =========================
  getStatusClass(p: Promotion): string {
    const now = new Date();
    const d1 = new Date(p.dateDebut);
    const d2 = new Date(p.dateFin);

    if (now >= d1 && now <= d2) return 'status-active';
    if (now < d1) return 'status-upcoming';
    return 'status-ended';
  }

  getStatusLabel(p: Promotion): string {
    const now = new Date();
    const d1 = new Date(p.dateDebut);
    const d2 = new Date(p.dateFin);

    if (now >= d1 && now <= d2) return 'ACTIVE';
    if (now < d1) return 'À VENIR';
    return 'TERMINÉE';
  }

  trackById(_: number, item: Promotion): string {
    return item._id;
  }

  // =========================
  // DELETE CONFIRM (HTML)
  // =========================
  openDeleteConfirm(promo: Promotion): void {
    this.promoToDelete = promo;
    this.showDeleteConfirm = true;
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm = false;
    this.promoToDelete = null;
  }

  confirmDelete(): void {
    if (!this.promoToDelete?._id) return;

    const id = this.promoToDelete._id;

    this.promoApi
      .deletePromotion(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.closeDeleteConfirm();
          if (this.promotions.length === 1 && this.page > 1) this.page--;
          this.loadPromotions();
        },
        error: (err: any) => {
          this.errorMessage = err?.error?.message || err?.message || 'Erreur suppression promotion';
          this.closeDeleteConfirm();
        },
      });
  }

  // =========================
  // ADD / EDIT
  // =========================
  openAddModal(): void {
    this.isEditMode = false;
    this.currentPromo = null;
    this.promoForm = this.emptyForm();
    this.selectedProducts = [];
    this.showModal = true;
  }

  openEditModal(p: Promotion): void {
    this.isEditMode = true;
    this.currentPromo = p;

    const eventId = (p as any)?.event?._id || (p as any)?.event || null;
    const ids = Array.isArray((p as any)?.productIds) ? (p as any).productIds : [];

    this.promoForm = {
      event: eventId || null,
      titre: p.titre || '',
      description: p.description || '',
      pourcentage: (p as any)?.pourcentage ?? null,
      dateDebut: this.toInputDate(p.dateDebut),
      dateFin: this.toInputDate(p.dateFin),
      scope: (p.scope as PromotionScope) || 'PRODUCTS',
      productIds: ids,
    };

    // chips (simple)
    this.selectedProducts = ids.map((id: string) => ({
      _id: id,
      nom: `Produit (${id.slice(0, 6)}...)`,
    }));

    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditMode = false;
    this.currentPromo = null;
    this.promoForm = this.emptyForm();
    this.selectedProducts = [];
    this.closeProductsPicker();
  }

  submitForm(): void {
    if (!this.promoForm.titre || !this.promoForm.pourcentage) {
      this.errorMessage = 'Veuillez remplir titre et pourcentage.';
      return;
    }
    if (!this.promoForm.dateDebut || !this.promoForm.dateFin) {
      this.errorMessage = 'Veuillez renseigner date début et date fin.';
      return;
    }

    if (
      this.promoForm.scope === 'PRODUCTS' &&
      (!this.promoForm.productIds || this.promoForm.productIds.length === 0)
    ) {
      this.errorMessage = 'Veuillez sélectionner au moins un produit (scope = PRODUCTS).';
      return;
    }

    if (!this.boutiqueId) {
      this.errorMessage = "Impossible de récupérer l'ID de la boutique de l'utilisateur connecté.";
      return;
    }

    const payload: any = {
      boutique: this.boutiqueId, // ✅ injecté automatiquement
      event: this.promoForm.event || null,
      titre: this.promoForm.titre,
      description: this.promoForm.description || '',
      pourcentage: Number(this.promoForm.pourcentage),
      dateDebut: this.promoForm.dateDebut,
      dateFin: this.promoForm.dateFin,
      scope: this.promoForm.scope,
      productIds: this.promoForm.scope === 'ALL_PRODUCTS' ? [] : this.promoForm.productIds,
    };

    console.log('Payload promotion à envoyer au backend :', payload);

    this.isSaving = true;
    this.errorMessage = '';

    const obs =
      this.isEditMode && this.currentPromo?._id
        ? this.promoApi.updatePromotion(this.currentPromo._id, payload)
        : this.promoApi.createPromotion(payload);

    obs.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.isSaving = false;
        this.closeModal();
        this.loadPromotions();
      },
      error: (err: any) => {
        console.log('CREATE PROMO 400 FULL ERR =', err);
        console.log('SERVER MESSAGE =', err?.error?.message);
        this.isSaving = false;
        this.errorMessage =
          err?.error?.message || err?.message || 'Erreur enregistrement promotion';
      },
    });
  }

  // =========================
  // PRODUITS PICKER (bouton + modal + chips)
  // =========================
  openProductsPicker(): void {
    // ✅ plus besoin de choisir boutique, mais on vérifie qu'on a l'id boutique du user
    if (!this.boutiqueId) {
      this.errorMessage = 'Impossible de charger les produits : boutiqueId introuvable.';
      return;
    }
    this.errorMessage = '';
    this.showProductsPicker = true;
    this.productsPage = 1;
    this.loadProducts();
  }

  closeProductsPicker(): void {
    this.showProductsPicker = false;
    this.productsSearch = '';
    this.products = [];
    this.productsPage = 1;
    this.productsTotalPages = 1;
    this.productsTotalItems = 0;
  }

  loadProducts(): void {
    if (!this.boutiqueId) return;

    this.produitApi
      .getProductsByBoutique(
        this.boutiqueId, // ✅ string
        this.productsPage,
        this.productsLimit,
        { search: this.productsSearch }, // ✅ filters
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.products = res?.data || [];
          this.productsTotalItems = res?.totalItems ?? this.products.length;
          this.productsTotalPages = res?.totalPages ?? 1;
        },
        error: () => {
          this.products = [];
          this.productsTotalPages = 1;
        },
      });
  }

  isProductSelected(id: string): boolean {
    return (this.promoForm.productIds || []).includes(id);
  }

  toggleProduct(p: ProduitLite): void {
    const ids = this.promoForm.productIds || [];
    const exists = ids.includes(p._id);

    if (exists) {
      this.promoForm.productIds = ids.filter((x) => x !== p._id);
      this.selectedProducts = this.selectedProducts.filter((x) => x._id !== p._id);
    } else {
      this.promoForm.productIds = [...ids, p._id];
      if (!this.selectedProducts.some((x) => x._id === p._id)) {
        this.selectedProducts = [...this.selectedProducts, p];
      }
    }
  }

  removeSelectedProduct(id: string): void {
    this.promoForm.productIds = (this.promoForm.productIds || []).filter((x) => x !== id);
    this.selectedProducts = this.selectedProducts.filter((x) => x._id !== id);
  }

  confirmProductsPicker(): void {
    this.closeProductsPicker();
  }

  onProductsPrev(): void {
    if (this.productsPage <= 1) return;
    this.productsPage--;
    this.loadProducts();
  }

  onProductsNext(): void {
    if (this.productsPage >= this.productsTotalPages) return;
    this.productsPage++;
    this.loadProducts();
  }

  // =========================
  // Utils
  // =========================
  private emptyForm() {
    return {
      event: null as string | null,
      titre: '',
      description: '',
      pourcentage: null,
      dateDebut: '',
      dateFin: '',
      scope: 'PRODUCTS' as PromotionScope,
      productIds: [] as string[],
    };
  }

  private toInputDate(d: any): string {
    if (!d) return '';
    const date = new Date(d);
    if (isNaN(date.getTime())) return '';
    const yyyy = String(date.getFullYear());
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
