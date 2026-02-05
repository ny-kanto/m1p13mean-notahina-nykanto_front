import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Produit } from '../../interface/produit';
import { ProduitService } from '../../services/produit';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaginationReponse } from '../../interface/pagination-reponse';
import { ProduitFiltre } from '../../interface/produit-filtre';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Produit[] = [];
  boutiqueId: string = '';

  // États
  isLoading: boolean = false;
  errorMessage: string = '';

  // Pagination
  currentPage: number = 1;
  limit: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;

  // Filtres
  filters: ProduitFiltre = {
    search: '',
    minPrice: undefined,
    maxPrice: undefined,
    stockStatus: 'all',
    sortBy: undefined,
    sortOrder: 'asc',
  };

  // Subject pour le debounce de la recherche
  private searchSubject = new Subject<string>();

  // Affichage des filtres
  showFilters: boolean = false;

  // Modal
  showModal: boolean = false;
  modalMode: 'add' | 'edit' = 'add';
  selectedProduct: Produit | null = null;

  // Images sélectionnées
  selectedFiles: File[] = [];

  // Formulaire
  productForm: Produit = {
    nom: '',
    prix: 0,
    description: '',
    stock: 0,
    boutiqueId: '',
    images: [],
  };

  // Pour désinscription
  private destroy$ = new Subject<void>();
Math: any;

  constructor(
    private productService: ProduitService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID depuis l'URL
    this.boutiqueId = this.route.snapshot.params['id'];

    // Configurer le debounce pour la recherche (300ms)
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        this.filters.search = searchTerm;
        this.currentPage = 1; // Retour à la première page
        this.loadProducts();
      });

    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Gestion de la sélection multiple d'images
   */
  onImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files) return;

    const files = Array.from(input.files);

    if (files.length > 5) {
      alert('❌ Maximum 5 images');
      return;
    }

    this.selectedFiles = files;
  }

  /**
   * Ouvrir la modal pour ajouter
   */
  openAddModal(): void {
    this.modalMode = 'add';
    this.productForm = {
      nom: '',
      prix: 0,
      description: '',
      stock: 0,
      boutiqueId: '',
      images: [],
    };
    this.selectedFiles = [];
    this.showModal = true;
  }

  /**
   * Ouvrir la modal pour modifier
   */
  openEditModal(product: Produit): void {
    this.modalMode = 'edit';
    this.selectedProduct = product;
    this.productForm = { ...product };
    this.showModal = true;
  }

  /**
   * Fermer la modal
   */
  closeModal(): void {
    this.showModal = false;
    this.selectedProduct = null;
    this.selectedFiles = [];
  }

  /**
   * Soumettre le formulaire (Ajout ou Modification)
   */
  submitForm(): void {
    if (this.modalMode === 'add') {
      this.addProduct();
    } else {
      this.editProduct();
    }
  }

  /**
   * Ajouter un produit
   */
  addProduct(): void {
    const formData = new FormData();

    formData.append('nom', this.productForm.nom);
    formData.append('prix', this.productForm.prix.toString());
    formData.append('description', this.productForm.description);
    formData.append('stock', this.productForm.stock.toString());
    formData.append('boutiqueId', this.boutiqueId);

    // Images optionnelles
    this.selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    this.productService
      .createProduct(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newProduct) => {
          this.closeModal();
          alert('✅ Produit ajouté avec succès !');
          // Recharger la première page pour voir le nouveau produit
          this.currentPage = 1;
          this.loadProducts();
        },
        error: (error) => {
          console.error(error);
          alert("❌ Erreur lors de l'ajout du produit");
        },
      });
  }

  /**
   * Charger tous les produits avec pagination et filtres
   */
  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService
      .getProductsByBoutique(this.boutiqueId, this.currentPage, this.limit, this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PaginationReponse) => {
          console.log('Produits récupérés:', response);
          this.products = response.data;
          this.totalPages = response.totalPages;
          this.totalItems = response.totalItems;
          this.currentPage = response.page;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.errorMessage = 'Impossible de charger les produits.';
          this.isLoading = false;
        },
      });
  }

  /**
   * Modifier un produit
   */
  editProduct(): void {
    if (!this.selectedProduct?._id) return;

    this.productService
      .updateProduct(this.selectedProduct._id, this.productForm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedProduct) => {
          console.log('Produit modifié:', updatedProduct);

          const index = this.products.findIndex((p) => p._id === updatedProduct._id);
          if (index !== -1) {
            this.products[index] = updatedProduct;
          }

          this.closeModal();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erreur:', error);
          alert('❌ Erreur lors de la modification');
        },
      });
  }

  /**
   * Voir les détails
   */
  viewDetails(product: Produit): void {
    console.log('Navigation vers détails de:', product);
    this.router.navigate(['/produit-boutique', product._id]);
  }

  /**
   * Obtenir la classe de stock
   */
  getStockClass(stock: number): string {
    if (stock === 0) return 'stock-empty';
    if (stock < 10) return 'stock-low';
    return 'stock-ok';
  }

  /**
   * MÉTHODES DE PAGINATION
   */

  /**
   * Aller à une page spécifique
   */
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadProducts();
  }

  /**
   * Page précédente
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  /**
   * Page suivante
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  /**
   * Générer le tableau des numéros de pages à afficher
   */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (this.totalPages <= maxPagesToShow) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, this.currentPage - 2);
      const endPage = Math.min(this.totalPages, this.currentPage + 2);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  /**
   * Changer le nombre d'éléments par page
   */
  changeLimit(newLimit: number): void {
    this.limit = newLimit;
    this.currentPage = 1;
    this.loadProducts();
  }

  /**
   * MÉTHODES DE FILTRAGE
   */

  /**
   * Recherche avec debounce
   */
  onSearchChange(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  /**
   * Appliquer les filtres
   */
  applyFilters(): void {
    this.currentPage = 1; // Retour à la première page
    this.loadProducts();
  }

  /**
   * Réinitialiser les filtres
   */
  resetFilters(): void {
    this.filters = {
      search: '',
      minPrice: undefined,
      maxPrice: undefined,
      stockStatus: 'all',
      sortBy: undefined,
      sortOrder: 'asc',
    };
    this.currentPage = 1;
    this.loadProducts();
  }

  /**
   * Basculer l'affichage des filtres
   */
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  /**
   * Changer le tri
   */
  changeSorting(sortBy: 'nom' | 'prix' | 'stock'): void {
    if (this.filters.sortBy === sortBy) {
      // Inverser l'ordre si on clique sur le même champ
      this.filters.sortOrder = this.filters.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.filters.sortBy = sortBy;
      this.filters.sortOrder = 'asc';
    }
    this.currentPage = 1;
    this.loadProducts();
  }

  /**
   * Vérifier si des filtres sont actifs
   */
  hasActiveFilters(): boolean {
    return !!(
      this.filters.search ||
      this.filters.minPrice !== undefined ||
      this.filters.maxPrice !== undefined ||
      (this.filters.stockStatus && this.filters.stockStatus !== 'all')
    );
  }

  /**
   * Obtenir l'icône de tri
   */
  getSortIcon(field: string): string {
    if (this.filters.sortBy !== field) return 'fas fa-sort';
    return this.filters.sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  }
}
