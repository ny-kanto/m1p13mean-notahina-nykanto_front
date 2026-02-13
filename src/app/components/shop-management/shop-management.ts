import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { BoutiqueService } from '../../services/boutique';
import { Boutique } from '../../interface/boutique';
import { Categorie } from '../../interface/categorie';
import { PaginationComponent } from '../pagination/pagination';
import { HoraireJour, JourSemaine } from '../../interface/horaire-jour';

@Component({
  selector: 'app-shop-management',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, RouterLink],
  templateUrl: './shop-management.html',
  styleUrls: ['./shop-management.css'],
})
export class ShopManagementComponent implements OnInit, OnDestroy {
  // Données
  boutiques: Boutique[] = [];
  categories: Categorie[] = [];

  // États UI
  isLoading = false;
  errorMessage = '';

  // Image
  selectedImage: File | null = null;

  // Modal
  showModal = false;
  showDeleteConfirm = false;
  modalMode: 'create' | 'edit' = 'create';

  // Formulaire
  currentBoutique: Boutique = this.getEmptyBoutique();
  boutiqueToDelete: Boutique | null = null;

  // Filtres
  searchQuery = '';
  filterCategorie = '';
  filterEtage = '';
  filterOuvert: '' | 'true' | 'false' = '';

  // Pagination
  page = 1;
  limit = 10;
  totalPages = 0;
  totalItems = 0;

  jours: JourSemaine[] = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  private destroy$ = new Subject<void>();

  constructor(
    private boutiqueService: BoutiqueService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadBoutiques();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Boutique vide
   */
  getEmptyBoutique(): Boutique {
    return {
      nom: '',
      categorie: '',
      etage: 0,
      contact: {
        email: '',
        tel: '',
      },
      horaires: {
        lundi: { ouverture: '', fermeture: '', ferme: false },
        mardi: { ouverture: '', fermeture: '', ferme: false },
        mercredi: { ouverture: '', fermeture: '', ferme: false },
        jeudi: { ouverture: '', fermeture: '', ferme: false },
        vendredi: { ouverture: '', fermeture: '', ferme: false },
        samedi: { ouverture: '', fermeture: '', ferme: false },
        dimanche: { ouverture: '', fermeture: '', ferme: false },
      },
      image: {
        url: '',
        public_id: '',
      },
    };
  }

  /**
   * ✅ Garantit que "image" est toujours présent
   */
  normalizeImage(image?: Boutique['image']): { url: string; public_id: string } {
    return {
      url: image?.url ?? '',
      public_id: image?.public_id ?? '',
    };
  }

  normalizeHoraires(
    horaires?: Partial<Record<JourSemaine, HoraireJour>>,
  ): Record<JourSemaine, HoraireJour> {
    const defaults = this.getEmptyBoutique().horaires;

    return this.jours.reduce(
      (acc, jour) => {
        acc[jour] = {
          ouverture: horaires?.[jour]?.ouverture ?? defaults[jour].ouverture,
          fermeture: horaires?.[jour]?.fermeture ?? defaults[jour].fermeture,
          ferme: horaires?.[jour]?.ferme ?? defaults[jour].ferme,
        };
        return acc;
      },
      {} as Record<JourSemaine, HoraireJour>,
    );
  }

  getHoraire(jour: JourSemaine): HoraireJour {
    return this.currentBoutique.horaires[jour];
  }

  /**
   * Charger boutiques
   */
  loadBoutiques(): void {
    this.isLoading = true;

    const filters = {
      search: this.searchQuery,
      categorie: this.filterCategorie,
      etage: this.filterEtage,
      ouvert: this.filterOuvert,
    };

    this.boutiqueService
      .getAllBoutiques(filters, this.page, this.limit)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          // ✅ Normaliser image pour TOUTES les boutiques (même celles qui n'ont pas d'image)
          this.boutiques = res.data.map((b: Boutique) => ({
            ...b,
            image: this.normalizeImage(b.image),
          }));

          this.totalItems = res.pagination.total;
          this.totalPages = res.pagination.totalPages;
          this.page = res.pagination.page;

          this.cdr.markForCheck();
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Impossible de charger les boutiques';
          this.isLoading = false;
        },
      });
  }

  onPageChange(page: number): void {
    this.page = page;
    this.loadBoutiques();
  }

  loadCategories(): void {
    this.boutiqueService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => (this.categories = data),
        error: (err) => console.error(err),
      });
  }

  applyFilters(): void {
    this.page = 1;
    this.loadBoutiques();
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.filterCategorie = '';
    this.filterEtage = '';
    this.filterOuvert = '';
    this.page = 1;
    this.loadBoutiques();
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.currentBoutique = this.getEmptyBoutique();
    this.selectedImage = null;
    this.showModal = true;
  }

  openEditModal(boutique: Boutique): void {
    this.modalMode = 'edit';

    this.currentBoutique = {
      ...this.getEmptyBoutique(), // ✅ base propre (inclut image par défaut)
      ...boutique,
      categorie:
        typeof boutique.categorie === 'string'
          ? boutique.categorie
          : boutique.categorie?._id || '',
      horaires: this.normalizeHoraires(boutique.horaires),
      image: this.normalizeImage(boutique.image), // ✅ jamais undefined
    };

    this.selectedImage = null;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentBoutique = this.getEmptyBoutique();
    this.selectedImage = null;
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedImage = input.files[0];
    }
  }

  saveBoutique(): void {
    this.modalMode === 'create' ? this.createBoutique() : this.updateBoutique();
  }

  /**
   * CREATE
   */
  createBoutique(): void {
    const formData = this.buildFormData();
    this.boutiqueService
      .createBoutique(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadBoutiques();
          this.closeModal();
          alert('✅ Boutique créée');
        },
        error: () => alert('❌ Erreur création'),
      });
  }

  /**
   * UPDATE
   */
  updateBoutique(): void {
    if (!this.currentBoutique._id) return;

    const formData = this.buildFormData();
    this.boutiqueService
      .updateBoutique(this.currentBoutique._id, formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadBoutiques();
          this.closeModal();
        },
        error: () => alert('❌ Erreur modification'),
      });
  }

  /**
   * Construire FormData
   */
  buildFormData(): FormData {
    const fd = new FormData();

    fd.append('nom', this.currentBoutique.nom);
    fd.append('categorie', this.currentBoutique.categorie.toString());
    fd.append('etage', this.currentBoutique.etage.toString());

    fd.append('contact[email]', this.currentBoutique.contact?.email || '');
    fd.append('contact[tel]', this.currentBoutique.contact?.tel || '');

    this.jours.forEach((jour) => {
      const h = this.currentBoutique.horaires[jour];
      fd.append(`horaires[${jour}][ferme]`, String(h?.ferme ?? false));

      if (h && !h.ferme) {
        fd.append(`horaires[${jour}][ouverture]`, h.ouverture || '');
        fd.append(`horaires[${jour}][fermeture]`, h.fermeture || '');
      }
    });

    if (this.selectedImage) {
      fd.append('image', this.selectedImage);
    }

    return fd;
  }

  openDeleteConfirm(boutique: Boutique): void {
    this.boutiqueToDelete = boutique;
    this.showDeleteConfirm = true;
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm = false;
    this.boutiqueToDelete = null;
  }

  deleteBoutique(): void {
    if (!this.boutiqueToDelete?._id) return;

    this.boutiqueService
      .deleteBoutique(this.boutiqueToDelete._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (this.boutiques.length === 1 && this.page > 1) this.page--;
          this.loadBoutiques();
          this.closeDeleteConfirm();
          alert('✅ Boutique supprimée');
        },
        error: () => alert('❌ Erreur suppression'),
      });
  }

  /**
   * Helpers UI
   */
  getCategorieNom(b: Boutique): string {
    if (typeof b.categorie === 'string') {
      return this.categories.find((c) => c._id === b.categorie)?.nom || 'N/A';
    }
    return b.categorie?.nom || 'N/A';
  }

  getStatutLabel(b: Boutique): string {
    return b.ouvertMaintenant ? 'Ouvert' : 'Fermé';
  }
}
