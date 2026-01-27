import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { ShopCardComponent } from './components/shop-card/shop-card';
import { BoutiqueService } from './services/boutique';
import { Boutique } from './interface/boutique';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ShopCardComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  shops: Boutique[] = [];

  // 1. Injecter le service
  constructor(private boutiqueService: BoutiqueService, private cdr: ChangeDetectorRef) {}

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
