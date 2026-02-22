import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProduitService } from '../../services/produit';
import { Produit } from '../../interface/produit';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Produit | null = null;
  productId: string = '';

  // États
  isLoading: boolean = false;
  errorMessage: string = '';

  // Galerie d'images
  selectedImageIndex: number = 0;

  // Pour désinscription
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProduitService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID depuis l'URL
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
   * Sélectionner une image dans la galerie
   */
  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  /**
   * Image suivante
   */
  nextImage(): void {
    if (this.product && this.product.images) {
      this.selectedImageIndex = (this.selectedImageIndex + 1) % this.product.images.length;
    }
  }

  /**
   * Image précédente
   */
  previousImage(): void {
    if (this.product && this.product.images) {
      this.selectedImageIndex =
        (this.selectedImageIndex - 1 + this.product.images.length) % this.product.images.length;
    }
  }

  /**
   * Retour à la liste
   */
  goBack(): void {
    this.router.navigate(['/boutiques', this.product?.boutiqueId, 'produits']);
  }
}
