import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Boutique } from '../../interface/boutique';
import { Categorie } from '../../interface/categorie';
import { BoutiqueService } from '../../services/boutique';

import { ShopCardComponent } from '../shop-card/shop-card';
import { Footer } from '../footer/footer';
import { HeaderHomeComponent } from '../header-home/header-home';

@Component({
  selector: 'app-shop-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ShopCardComponent,
    Footer,
    HeaderHomeComponent,
  ],
  templateUrl: './shop-list.html',
  styleUrl: './shop-list.css',
})
export class ShopListComponent implements OnInit {
  shops: Boutique[] = [];
  categories: Categorie[] = [];
  isLoading = true;

  // filtres
  filterCategorie = '';
  onlyOpen = false;

  // pagination
  page = 1;
  limit = 20;
  totalPages = 0;
  totalItems = 0;

  constructor(
    private boutiqueService: BoutiqueService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadShops();
  }

  loadCategories(): void {
    this.boutiqueService.getAllCategories().subscribe({
      next: (cats) => {
        this.categories = cats ?? [];
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Erreur catégories', err),
    });
  }

  loadShops(): void {
    this.isLoading = true;

    const filters: any = {
      categorie: this.filterCategorie,
      // ouvert doit être "true"/"" car ton backend attend des strings
      ouvert: this.onlyOpen ? 'true' : '',
    };

    this.boutiqueService.getAllBoutiques(filters, this.page, this.limit).subscribe({
      next: (res) => {
        this.shops = res.data ?? [];

        // pagination venant du backend
        this.totalItems = res.pagination?.total ?? this.shops.length;
        this.totalPages = res.pagination?.totalPages ?? 1;
        this.page = res.pagination?.page ?? this.page;

        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('ERREUR HTTP', err);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onPageChange(page: number): void {
    this.page = page;
    this.loadShops();
  }

  applyFilters(): void {
    this.page = 1;
    this.loadShops();
  }

  toggleOnlyOpen(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.onlyOpen = checked;
    this.applyFilters();
  }

  goToPage(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.page = newPage;
    this.loadShops();
  }
}
