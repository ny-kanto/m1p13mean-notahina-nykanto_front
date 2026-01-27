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
  // On reçoit l'objet boutique complet
  @Input({ required: true }) boutique!: Boutique;

  // Méthode pour choisir la couleur du badge selon le statut
  getStatusClass() {
    return {
      'status-open': this.boutique.statut === 'Ouvert',
      'status-closed': this.boutique.statut === 'Fermé'
    };
  }
}
