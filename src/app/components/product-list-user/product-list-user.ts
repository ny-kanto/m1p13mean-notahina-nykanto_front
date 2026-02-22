import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Produit } from '../../interface/produit';
import { ProduitFiltre } from '../../interface/produit-filtre';
import { ProduitService } from '../../services/produit';
import { ProductCardComponent } from '../product-card/product-card';
import { PaginationComponent } from '../pagination/pagination';
import { HeaderHomeComponent } from '../header-home/header-home';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProductCardComponent,
    PaginationComponent,
    HeaderHomeComponent,
    Footer,
  ],
  templateUrl: './product-list-user.html',
  styleUrls: ['./product-list-user.css'],
})
export class ProductListUserComponent implements OnInit {
  // Données
  products: Produit[] = [];
  boutiqueId?: string;
  boutiqueNom = '';

  // Filtres
  filters: ProduitFiltre = {
    search: '',
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: 'nom',
    sortOrder: 'asc',
  };

  // Pagination
  page = 1;
  limit = 12;
  totalItems = 0;
  totalPages = 0;

  // États
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produitService: ProduitService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de la boutique depuis l'URL (optionnel)
    this.boutiqueId = this.route.snapshot.paramMap.get('id') || undefined;

    // Charger les produits
    this.loadProducts();
  }

  /**
   * Charger les produits avec filtres et pagination
   */
  loadProducts(): void {
    if (!this.boutiqueId) return;

    this.isLoading = true;

    this.produitService
      .getProductsByBoutique(this.boutiqueId, this.page, this.limit, this.filters)
      .subscribe({
        next: (response) => {
          this.products = response.data || [];
          this.totalItems = response.pagination?.total || 0;
          this.totalPages = response.pagination?.totalPages || 1;
          this.page = response.pagination?.page || 1;

          if ((response as any).boutique?.nom) {
            this.boutiqueNom = (response as any).boutique.nom;
          }

          console.log('Produits chargés:', this.products);
          this.cdr.markForCheck();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur chargement produits:', error);
          this.isLoading = false;
        },
      });
  }

  /**
   * Appliquer les filtres
   */
  applyFilters(): void {
    this.page = 1; // Reset à la page 1
    this.loadProducts();
  }

  goBackToBoutique(): void {
    if (!this.boutiqueId) return;

    this.router.navigate(['/boutiques', this.boutiqueId]);
  }

  /**
   * Réinitialiser les filtres
   */
  resetFilters(): void {
    this.filters = {
      search: '',
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: 'nom',
      sortOrder: 'asc',
    };
    this.page = 1;
    this.loadProducts();
  }

  /**
   * Changer l'ordre de tri
   */
  setSortOrder(order: 'asc' | 'desc'): void {
    this.filters.sortOrder = order;
    this.applyFilters();
  }

  /**
   * Changer de page
   */
  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadProducts();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
