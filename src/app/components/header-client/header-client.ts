import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-client',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-client.html',
  styleUrl: './header-client.css',
})
export class HeaderClient {
  centreName = 'Akoor Shopping';

  // Menu items pour le client
  menuItems = [
    { label: 'Accueil', route: '/home', icon: 'fas fa-home' },
    { label: 'Boutiques', route: '/boutiques', icon: 'fas fa-store' },
    { label: 'Promotions', route: '/promotions', icon: 'fas fa-tags' },
    { label: 'Contact', route: '/contact', icon: 'fas fa-envelope' },
  ];

  // Panier
  cartItemsCount = 3;

  showUserMenu = false;

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    console.log('Déconnexion');
  }
}
