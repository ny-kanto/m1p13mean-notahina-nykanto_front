import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { ProduitService } from '../../services/produit';
import { Produit } from '../../interface/produit';

import { AvisApi } from '../../interface/avis';
import { AvisService } from '../../services/avis';
import { HeaderHomeComponent } from '../header-home/header-home';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderHomeComponent, Footer],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css'],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Produit | null = null;
  productId = '';

  isLoading = false;
  errorMessage = '';

  selectedImageIndex = 0;

  // ✅ avis
  avis: AvisApi[] = [];
  avisLoading = false;
  avisError = '';

  // ✅ formulaire avis
  myNote: number = 0;
  myCommentaire: string = '';
  sendingAvis = false;
  sendError = '';
  sendSuccess = '';

  hover = 0;

  setNote(note: number) {
    this.myNote = note;
  }

  setHover(value: number) {
    this.hover = value;
  }

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProduitService,
    private avisService: AvisService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    if (this.productId) this.loadProduct();
    else this.errorMessage = 'ID produit manquant.';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProduct(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.productService
      .getProductById(this.productId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.product = data;
          this.selectedImageIndex = 0;
          this.isLoading = false;

          // ✅ charger les avis du produit
          if (this.product?._id) this.loadAvis(this.product._id);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.errorMessage = err?.message ?? 'Impossible de charger le produit.';
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  loadAvis(entityId: string): void {
    this.avisLoading = true;
    this.avisError = '';

    this.avisService
      .getAvisForEntity('produit', entityId, 1, 10)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.avis = res.data ?? [];
          this.avisLoading = false;
        },
        error: (err) => {
          this.avisError = err?.message ?? 'Impossible de charger les avis.';
          this.avisLoading = false;
        },
      });
  }

  submitAvis(): void {
    const entityId = this.product?._id;
    if (!entityId) return;

    // Reset messages
    this.sendError = '';
    this.sendSuccess = '';

    // Validation
    if (this.myCommentaire.trim() === '') {
      this.sendError = 'Veuillez écrire un commentaire';
      return;
    }

    this.sendingAvis = true;

    this.avisService
      .upsertAvis({
        entityType: 'produit',
        entityId,
        note: this.myNote,
        commentaire: this.myCommentaire,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.sendingAvis = false;
          this.sendSuccess = res.message ?? 'Avis enregistré avec succès !';

          this.loadAvis(entityId);

          // Masquer le message de succès après 3 secondes
          setTimeout(() => {
            this.sendSuccess = '';
          }, 3000);
        },
        error: (err) => {
          this.sendingAvis = false;
          this.sendError = err?.message ?? "Erreur lors de l'envoi de l'avis.";
        },
      });
  }

  deleteAvis(avisId: string): void {
    const entityId = this.product?._id;
    if (!entityId) return;

    if (!confirm('Voulez-vous vraiment supprimer cet avis ?')) return;

    this.avisService
      .deleteAvis(avisId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadAvis(entityId);
        },
        error: (err) => {
          this.avisError = err?.message ?? 'Erreur suppression avis';
        },
      });
  }

  // helpers user
  userName(a: AvisApi): string {
    return typeof a.user === 'string' ? a.user : a.user?.nom || 'Utilisateur';
  }

  // images
  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  nextImage(): void {
    if (!this.product?.images || this.product.images.length === 0) return;
    const len = this.product.images.length;
    this.selectedImageIndex = (this.selectedImageIndex + 1) % len;
  }

  previousImage(): void {
    if (!this.product?.images || this.product.images.length === 0) return;
    const len = this.product.images.length;
    this.selectedImageIndex = (this.selectedImageIndex - 1 + len) % len;
  }

  goBack(): void {
    const boutiqueId = this.product?.boutiqueId;
    if (boutiqueId) this.router.navigate(['/produits', boutiqueId]);
    else this.router.navigate(['/boutiques']);
  }
}
