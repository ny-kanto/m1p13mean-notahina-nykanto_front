import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-boutique',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-boutique.html',
  styleUrl: './header-boutique.css',
})
export class HeaderBoutique {
  // Nom de la boutique (à récupérer depuis un service)
  shopName = 'Zara';

  // Menu items pour le propriétaire de boutique
  menuItems = [
    { label: 'Mes produits', route: '/boutique/produits', icon: 'fas fa-box' },
    { label: 'Commandes', route: '/boutique/commandes', icon: 'fas fa-shopping-cart' },
    { label: 'Statistiques', route: '/boutique/stats', icon: 'fas fa-chart-line' },
    { label: 'Mon profil', route: '/boutique/profil', icon: 'fas fa-store-alt' },
  ];

  showUserMenu = false;

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    console.log('Déconnexion');
  }
}
