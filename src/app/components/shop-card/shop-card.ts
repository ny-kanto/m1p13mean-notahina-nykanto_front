import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

import { Boutique } from '../../interface/boutique';
import { AuthService } from '../../services/auth.service';
import { FavorisService } from '../../services/favoris';

@Component({
  selector: 'app-shop-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shop-card.html',
  styleUrls: ['./shop-card.css'],
})
export class ShopCardComponent implements OnInit {
  @Input({ required: true }) boutique!: Boutique;

  // ✅ État favori local
  isFavorite = false;
  isToggling = false; // Empêche les doubles clics

  constructor(
    private authService: AuthService,
    private favorisService: FavorisService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // ✅ Initialiser l'état favori si l'utilisateur est connecté
    if (this.authService.isLoggedIn() && this.boutique?._id) {
      this.favorisService.isFavori(this.boutique._id).subscribe({
        next: (res) => {
          this.isFavorite = res.isFavori;
          this.cdr.markForCheck();
        },
        error: () => {
          this.isFavorite = false;
        },
      });
    }
    this.cdr.markForCheck();
  }

  fallbackImage = 'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?w=800&q=80';

  getShopImage(): string {
    const url = this.boutique?.image?.url?.trim();
    return url ? url : this.fallbackImage;
  }

  getCategorieLabel(): string {
    const cat = this.boutique?.categorie;
    if (!cat) return 'N/A';
    return typeof cat === 'string' ? cat : (cat.nom ?? 'N/A');
  }

  getEtageLabel(): string {
    if (this.boutique?.etage === 0) return 'Rez-de-chaussée';
    return `Étage ${this.boutique?.etage ?? 'N/A'}`;
  }

  getStatusClass(): string {
    return this.boutique?.ouvertMaintenant ? 'open' : 'closed';
  }

  getStatusLabel(): string {
    return this.boutique?.ouvertMaintenant ? 'Ouvert' : 'Fermé';
  }

  viewDetails(): void {
    if (!this.boutique?._id) return;
    this.router.navigate(['/boutique-details', this.boutique._id]);
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    // ✅ Pas connecté → redirect login
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { redirect: `/boutiques/${this.boutique._id}` },
      });
      return;
    }

    if (!this.boutique._id || this.isToggling) return;

    // ✅ Optimistic update — changement immédiat de l'UI
    this.isToggling = true;
    this.isFavorite = !this.isFavorite;

    this.cdr.markForCheck();
    this.favorisService.toggleBoutique(this.boutique._id).subscribe({
      next: (res) => {
        const serverValue = res?.data?.isFavorite;
        if (typeof serverValue === 'boolean') {
          this.isFavorite = serverValue;
        }
        this.cdr.markForCheck();
        this.isToggling = false;
      },
      error: (err) => {
        console.error('Erreur toggle favoris', err);
        this.isFavorite = !this.isFavorite;
        this.isToggling = false;
      },
    });
  }
}
