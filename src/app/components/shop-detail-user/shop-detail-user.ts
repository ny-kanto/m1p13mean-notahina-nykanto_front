import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { Footer } from '../footer/footer';
import { HeaderHomeComponent } from '../header-home/header-home';

import { Boutique } from '../../interface/boutique';
import { BoutiqueService } from '../../services/boutique';
import { AuthService } from '../../services/auth.service';
import { FavorisService } from '../../services/favoris';

@Component({
  selector: 'app-shop-detail-user',
  standalone: true,
  imports: [CommonModule, RouterModule, Footer, HeaderHomeComponent],
  templateUrl: './shop-detail-user.html',
  styleUrl: './shop-detail-user.css',
})
export class ShopDetailUserComponent implements OnInit, OnDestroy {
  boutique: Boutique | null = null;
  isLoading = false;
  errorMessage = '';

  // ✅ Favoris
  isFavorite = false;
  isToggling = false;

  // ⚠️ clés EXACTES du backend
  joursOrdered = [
    { key: 'lundi', label: 'Lundi' },
    { key: 'mardi', label: 'Mardi' },
    { key: 'mercredi', label: 'Mercredi' },
    { key: 'jeudi', label: 'Jeudi' },
    { key: 'vendredi', label: 'Vendredi' },
    { key: 'samedi', label: 'Samedi' },
    { key: 'dimanche', label: 'Dimanche' },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private boutiqueService: BoutiqueService,
    private authService: AuthService,
    private favorisService: FavorisService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadBoutique(id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBoutique(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.boutiqueService
      .getBoutiqueById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.boutique = res.data;

          this.initFavoriteState();

          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.errorMessage = 'Impossible de charger les détails de la boutique.';
          this.isLoading = false;
        },
      });
  }

  private initFavoriteState(): void {
    const boutiqueId = this.boutique?._id;
    if (!boutiqueId) return;

    // Pas connecté => pas besoin de call API
    if (!this.authService.isLoggedIn()) {
      this.isFavorite = false;
      return;
    }

    this.favorisService
      .isFavori(boutiqueId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isFavorite = !!res.isFavori;
          this.cdr.markForCheck();
        },
        error: () => {
          this.isFavorite = false;
        },
      });
  }

  getCategorieNom(): string {
    if (!this.boutique) return 'N/A';
    if (typeof this.boutique.categorie === 'string') return 'N/A';
    return this.boutique.categorie?.nom || 'N/A';
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    const boutiqueId = this.boutique?._id;
    if (!boutiqueId) return;

    // ✅ Pas connecté → redirect login avec redirect vers la page actuelle
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { redirect: `/boutiques/${boutiqueId}` },
      });
      return;
    }

    if (this.isToggling) return;

    // ✅ Optimistic update
    this.isToggling = true;
    this.isFavorite = !this.isFavorite;
    this.cdr.markForCheck();

    this.favorisService
      .toggleBoutique(boutiqueId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          // ⚠️ Backend => res.data.isFavorite
          const serverValue = res?.data?.isFavorite;
          if (typeof serverValue === 'boolean') {
            this.isFavorite = serverValue;
          }
          this.isToggling = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Erreur toggle favoris', err);
          // rollback
          this.isFavorite = !this.isFavorite;
          this.isToggling = false;
          this.cdr.markForCheck();
        },
      });
  }

  /**
   * Horaires corrects par jour
   */
  getHorairesForDay(jourKey: string): string {
    if (!this.boutique?.horaires) return 'Fermé';

    const horaire = (this.boutique.horaires as any)[jourKey];
    if (!horaire || horaire.ferme) return 'Fermé';

    return `${horaire.ouverture} — ${horaire.fermeture}`;
  }

  isToday(jourKey: string): boolean {
    const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    return jours[new Date().getDay()] === jourKey;
  }

  goBack(): void {
    this.router.navigate(['/boutiques']);
  }

  goToMap(): void {
    this.router.navigate(['/mall-map'], this.boutique?._id ? { queryParams: { boutiqueId: this.boutique._id , etage : this.boutique.etage } } : undefined);
  }

  visitShop(): void {
    const boutiqueId = this.boutique?._id;
    if (!boutiqueId) return;

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { redirect: `/boutiques/${boutiqueId}` },
      });
      return;
    }

    if (!this.authService.isAcheteur()) {
      alert('Accès réservé aux acheteurs.');
      return;
    }

    this.router.navigate(['/produits', boutiqueId]);
  }

  getEtageLabel(): string {
    if (!this.boutique) return 'N/A';
    return this.boutique.etage === 0 ? 'Rez-de-chaussée' : `Étage ${this.boutique.etage}`;
  }

  getStatutLabel(): string {
    return this.boutique?.ouvertMaintenant ? 'Ouvert' : 'Fermé';
  }

  getStatutClass(): string {
    return this.boutique?.ouvertMaintenant ? 'status-open' : 'status-closed';
  }

  getStatutIcon(): string {
    return this.boutique?.ouvertMaintenant ? 'fa-check-circle' : 'fa-times-circle';
  }
}
