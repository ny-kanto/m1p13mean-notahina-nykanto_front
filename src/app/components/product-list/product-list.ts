import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Produit } from '../../interface/produit';
import { ProduitService } from '../../services/produit';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(
    private productService: ProduitService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID depuis l'URL
    this.boutiqueId = this.route.snapshot.params['id'];
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
    // this.selectedImages = [...(product.images || [])];
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
          this.products.push(newProduct);
          this.closeModal();
          alert('✅ Produit ajouté avec succès !');
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error(error);
          alert("❌ Erreur lors de l'ajout du produit");
        },
      });
  }

  /**
   * Charger tous les produits
   */
  loadProducts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService
      .getProductsByBoutique(this.boutiqueId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('Produits récupérés:', data);
          this.products = data;
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
          //   alert('✅ Produit modifié avec succès !');
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
    // Navigation vers la page détails
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
}
