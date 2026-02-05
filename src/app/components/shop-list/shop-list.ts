import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Boutique } from '../../interface/boutique';
import { BoutiqueService } from '../../services/boutique';
import { CommonModule } from '@angular/common';
import { ShopCardComponent } from '../shop-card/shop-card';
import { Footer } from "../footer/footer";
import { HeaderHomeComponent } from "../header-home/header-home";

@Component({
  selector: 'app-shop-list',
  standalone: true,
  imports: [CommonModule, ShopCardComponent, Footer, HeaderHomeComponent],
  templateUrl: './shop-list.html',
  styleUrl: './shop-list.css',
})
export class ShopListComponent implements OnInit {
  shops: Boutique[] = [];
  isLoading = true;

  // 1. Injecter le service
  constructor(
    private boutiqueService: BoutiqueService,
    private cdr: ChangeDetectorRef,
  ) {}

  // 2. Appeler l'API au démarrage
  ngOnInit() {
    console.log('ngOnInit appelé');

    this.boutiqueService.getBoutiques().subscribe({
      next: (data) => {
        console.log('DATA REÇUE', data);
        this.shops = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('ERREUR HTTP', err);
        this.isLoading = false;
      },
    });
  }
}
