// product-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Produit } from '../../interface/produit';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css'],
})
export class ProductCardComponent {
  @Input() product!: Produit;

  getStarType(star: number, rating?: number): 'full' | 'half' | 'empty' {
    const value = Number(rating ?? 0);
    const floor = Math.floor(value);
    const decimal = value - floor;

    if (star <= floor) return 'full';
    if (star === floor + 1 && decimal >= 0.5) return 'half';
    return 'empty';
  }
}
