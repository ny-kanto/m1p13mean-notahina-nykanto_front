import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header-center',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-center.html',
  styleUrl: './header-center.css',
})
export class HeaderCenter {
  // Nom du centre commercial (tu peux le récupérer depuis un service)
  centreName = 'Akoor Shopping Center';

  // Menu items pour l'admin du centre
  menuItems = [
    { label: 'Tableau de bord', route: '/centre/dashboard', icon: 'fas fa-tachometer-alt' },
    { label: 'Boutiques', route: '/centre/boutiques', icon: 'fas fa-store' },
    { label: 'Statistiques', route: '/centre/stats', icon: 'fas fa-chart-bar' },
    { label: 'Utilisateurs', route: '/centre/users', icon: 'fas fa-users' },
  ];

  // Menu utilisateur
  showUserMenu = false;

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    // TODO: Implémenter la déconnexion
    console.log('Déconnexion');
  }
}
