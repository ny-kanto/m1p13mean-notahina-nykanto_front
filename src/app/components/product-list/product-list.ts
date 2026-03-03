import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { Produit } from '../../interface/produit';
import { ProduitService } from '../../services/produit';
import { PaginationReponse } from '../../interface/pagination-reponse';
import { ProduitFiltre } from '../../interface/produit-filtre';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css'], // ✅ important
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Produit[] = [];
  boutiqueId = '';

  // États
  isLoading = false;
  errorMessage = '';

  // Pagination
  currentPage = 1;
  limit = 10;
  totalPages = 0;
  totalItems = 0;

  // Filtres
  filters: ProduitFiltre = {
    search: '',
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: undefined,
    sortOrder: 'asc',
  };

  // UI
  showFilters = false;

  // Modal
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
  selectedProduct: Produit | null = null;

  // Images
  selectedFiles: File[] = [];

  // Form
  productForm: Produit = {
    nom: '',
    prix: 0,
    description: '',
    boutiqueId: '',
    images: [],
  };

  // Pour template (pagination-info)
  Math = Math;

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private productService: ProduitService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const user = this.auth.getUser(); // ou decode token
    this.boutiqueId = user?.boutiqueId ?? '';

    if (!this.boutiqueId) {
      this.router.navigate(['/login']); // ou page erreur
      return;
    }

    this.loadProducts();

    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((searchTerm) => {
        this.filters.search = searchTerm;
        this.currentPage = 1;
        this.loadProducts();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

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

  openAddModal(): void {
    this.modalMode = 'add';
    this.selectedProduct = null;
    this.productForm = {
      nom: '',
      prix: 0,
      description: '',
      boutiqueId: this.boutiqueId, // ✅ cohérent
      images: [],
    };
    this.selectedFiles = [];
    this.showModal = true;
  }

  openEditModal(product: Produit): void {
    this.modalMode = 'edit';
    this.selectedProduct = product;
    this.productForm = { ...product };
    this.selectedFiles = [];
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedProduct = null;
    this.selectedFiles = [];
  }

  submitForm(): void {
    if (this.modalMode === 'add') this.addProduct();
    else this.editProduct();
  }

  addProduct(): void {
    if (!this.boutiqueId) {
      alert("❌ Boutique introuvable dans l'URL");
      return;
    }

    const formData = new FormData();
    formData.append('nom', this.productForm.nom);
    formData.append('prix', String(this.productForm.prix ?? 0));
    formData.append('description', this.productForm.description ?? '');
    formData.append('boutiqueId', this.boutiqueId);

    this.selectedFiles.forEach((file) => formData.append('images', file));

    this.productService
      .createProduct(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.closeModal();
          this.currentPage = 1;
          this.loadProducts();
        },
        error: (err) => {
          console.error(err);
          alert("❌ Erreur lors de l'ajout du produit");
        },
      });
  }

  loadProducts(): void {
    if (!this.boutiqueId) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.productService
      .getProductsByBoutique(this.boutiqueId, this.currentPage, this.limit, this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PaginationReponse<Produit>) => {
          this.products = response.data ?? [];
          this.totalPages = response.pagination?.totalPages ?? 0;

          // ✅ correction: backend = total
          this.totalItems = (response.pagination as any)?.total ?? 0;

          this.currentPage = response.pagination?.page ?? this.currentPage;
          this.isLoading = false;

          this.cdr.markForCheck();
        },
        error: (error: any) => {
          console.error('Erreur:', error);
          this.errorMessage = 'Impossible de charger les produits.';
          this.isLoading = false;
        },
      });
  }

  editProduct(): void {
    if (!this.selectedProduct?._id) return;

    this.productService
      .updateProduct(this.selectedProduct._id, this.productForm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedProduct: Produit) => {
          const index = this.products.findIndex((p) => p._id === updatedProduct._id);
          if (index !== -1) this.products[index] = updatedProduct;
          this.closeModal();
        },
        error: (error: any) => {
          console.error('Erreur:', error);
          alert('❌ Erreur lors de la modification');
        },
      });
  }

  viewDetails(product: Produit): void {
    this.router.navigate(['/produit-boutique', product._id]);
  }

  // Pagination
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadProducts();
  }

  previousPage(): void {
    if (this.currentPage <= 1) return;
    this.currentPage--;
    this.loadProducts();
  }

  nextPage(): void {
    if (this.currentPage >= this.totalPages) return;
    this.currentPage++;
    this.loadProducts();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (this.totalPages <= maxPagesToShow) {
      for (let i = 1; i <= this.totalPages; i++) pages.push(i);
      return pages;
    }

    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  }

  changeLimit(newLimit: number): void {
    this.limit = Number(newLimit);
    this.currentPage = 1;
    this.loadProducts();
  }

  // Filtres
  onSearchChange(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  resetFilters(): void {
    this.filters = {
      search: '',
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: undefined,
      sortOrder: 'asc',
    };
    this.currentPage = 1;
    this.loadProducts();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  changeSorting(sortBy: 'nom' | 'prix'): void {
    if (this.filters.sortBy === sortBy) {
      this.filters.sortOrder = this.filters.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.filters.sortBy = sortBy;
      this.filters.sortOrder = 'asc';
    }
    this.currentPage = 1;
    this.loadProducts();
  }

  hasActiveFilters(): boolean {
    return !!(
      (this.filters.search && this.filters.search.trim()) ||
      this.filters.minPrice !== undefined ||
      this.filters.maxPrice !== undefined
    );
  }

  getSortIcon(field: string): string {
    if (this.filters.sortBy !== field) return 'fas fa-sort';
    return this.filters.sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  }
}
