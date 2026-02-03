import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Boutique } from '../../interface/boutique';
import { BoutiqueService } from '../../services/boutique';
import { CommonModule } from '@angular/common';
import { ShopCardComponent } from '../shop-card/shop-card';
import { Footer } from "../footer/footer";
import { HeaderCenter } from "../header-center/header-center";
import { HeaderBoutique } from "../header-boutique/header-boutique";
import { HeaderClient } from '../header-client/header-client';

@Component({
  selector: 'app-shop-list',
  standalone: true,
  imports: [CommonModule, ShopCardComponent, Footer, HeaderCenter, HeaderBoutique, HeaderClient],
  templateUrl: './shop-list.html',
  styleUrl: './shop-list.css',
})
export class ShopListComponent implements OnInit {
  shops: Boutique[] = [];

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
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('ERREUR HTTP', err);
      },
    });
  }
}
