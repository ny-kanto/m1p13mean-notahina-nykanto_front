import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProduitService } from '../../services/produit';
import { Produit } from '../../interface/produit';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-detail-boutique',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail-boutique.html',
  styleUrl: './product-detail-boutique.css',
})
export class ProductDetailBoutiqueComponent implements OnInit, OnDestroy {
  product: Produit | null = null;
  productId: string = '';

  // États
  isLoading: boolean = false;
  errorMessage: string = '';

  // Modal
  showEditModal: boolean = false;
  showDeleteConfirm: boolean = false;

  // Formulaire d'édition
  editForm: Produit = {
    nom: '',
    prix: 0,
    description: '',
    stock: 0,
    boutiqueId: '',
    images: [],
  };

  // Statistiques simulées (à remplacer par vraies données API)
  stats = {
    ventesMois: 45,
    revenusTotal: 1350000,
    vuesTotal: 234,
    favorisTotal: 18,
  };

  // Galerie
  selectedImageIndex: number = 0;
  selectedFiles: File[] = [];

  // Pour désinscription
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProduitService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.params['id'];
    this.loadProduct();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charger le produit
   */
  loadProduct(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService
      .getProductById(this.productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log('Produit récupéré:', data);
          this.product = data;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erreur:', error);
          this.errorMessage = 'Impossible de charger le produit.';
          this.isLoading = false;
        },
      });
  }

  /**
   * Ajuster le stock
   */
  adjustStock(amount: number): void {
    if (!this.product) return;

    const newStock = Math.max(0, this.product.stock + amount);
    this.editForm.stock = newStock;

    if (this.product._id) {
      this.productService
        .updateProduct(this.product._id, { stock: newStock })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updated) => {
            this.product = updated;
            alert(`Stock mis à jour : ${newStock} unités`);
          },
          error: (error) => {
            console.error('Erreur:', error);
            alert('❌ Erreur lors de la mise à jour du stock');
          },
        });
    }
  }

  /**
   * Sélectionner une image
   */
  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  /**
   * Gestion des images
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
   * Retour à la liste
   */
  goBack(): void {
    this.router.navigate(['/produits/boutique/', this.product?.boutiqueId]);
  }

  /**
   * Classe de stock
   */
  getStockClass(): string {
    if (!this.product) return '';
    if (this.product.stock === 0) return 'stock-empty';
    if (this.product.stock < 10) return 'stock-low';
    return 'stock-ok';
  }

  /**
   * Statut du stock
   */
  getStockStatus(): string {
    if (!this.product) return '';
    if (this.product.stock === 0) return 'Rupture de stock';
    if (this.product.stock < 10) return 'Stock faible';
    return 'En stock';
  }
}
