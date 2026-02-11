import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BoutiqueService } from '../../services/boutique';
import { Boutique } from '../../interface/boutique';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-shop-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shop-detail.html',
  styleUrls: ['./shop-detail.css'],
})
export class ShopDetailComponent implements OnInit, OnDestroy {
  boutique: Boutique | null = null;
  isLoading = false;
  errorMessage = '';

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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBoutique(id);
    }
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
          this.cdr.markForCheck();
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Impossible de charger les détails de la boutique.';
          this.isLoading = false;
        },
      });
  }

  getCategorieNom(): string {
    if (!this.boutique) return 'N/A';
    if (typeof this.boutique.categorie === 'string') return 'N/A';
    return this.boutique.categorie?.nom || 'N/A';
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

  /**
   * Jour courant
   */
  isToday(jourKey: string): boolean {
    const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    return jours[new Date().getDay()] === jourKey;
  }

  goBack(): void {
    this.router.navigate(['/admin/boutiques']);
  }

  getEtageLabel(): string {
    if (!this.boutique) return 'N/A';
    return this.boutique.etage === 0
      ? 'Rez-de-chaussée'
      : `Étage ${this.boutique.etage}`;
  }

  /**
   * Statut basé sur ouvertMaintenant
   */
  getStatutLabel(): string {
    return this.boutique?.ouvertMaintenant ? 'Ouvert' : 'Fermé';
  }

  getStatutClass(): string {
    return this.boutique?.ouvertMaintenant ? 'status-open' : 'status-closed';
  }

  getStatutIcon(): string {
    return this.boutique?.ouvertMaintenant
      ? 'fa-check-circle'
      : 'fa-times-circle';
  }
}
