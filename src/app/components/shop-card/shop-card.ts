import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Boutique } from '../../interface/boutique';

@Component({
  selector: 'app-shop-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shop-card.html',
  styleUrls: ['./shop-card.css']
})
export class ShopCardComponent {
  @Input() boutique!: Boutique;

  /**
   * Retourne la classe CSS pour le statut
   */
  getStatusClass(): string {
    return this.boutique.ouvertMaintenant === true ? 'status-open' : 'status-closed';
  }

  /**
   * Retourne l'image par défaut si aucune image
   */
  getShopImage(): string {
    return this.boutique.image?.url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500';
  }

  /**
   * Navigation vers les produits de la boutique
   */
  viewProducts(): void {
    console.log('Voir les produits de:', this.boutique.nom);
    // TODO: Implémenter la navigation
    // this.router.navigate(['/boutique', this.boutique._id, 'produits']);
  }
}
