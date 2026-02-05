import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header-home.html',
  styleUrl: './header-home.css'
})
export class HeaderHomeComponent implements OnInit {
  isScrolled = false;
  searchQuery = '';
  isSearchFocused = false;
  isMobileMenuOpen = false;

  ngOnInit(): void {
    this.checkScroll();
  }

  /**
   * Détecte le scroll pour changer le fond du header
   */
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkScroll();
  }

  /**
   * Vérifie la position du scroll
   */
  private checkScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50;
  }

  /**
   * Gère la recherche
   */
  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Recherche:', this.searchQuery);
      // TODO: Implémenter la logique de recherche
      // this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }

  /**
   * Focus sur la barre de recherche
   */
  onSearchFocus(): void {
    this.isSearchFocused = true;
  }

  /**
   * Blur sur la barre de recherche
   */
  onSearchBlur(): void {
    this.isSearchFocused = false;
  }

  /**
   * Efface la recherche
   */
  clearSearch(): void {
    this.searchQuery = '';
  }

  /**
   * Toggle menu mobile
   */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  /**
   * Ferme le menu mobile
   */
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
