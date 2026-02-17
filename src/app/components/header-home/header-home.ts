import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // ✅ adapte le path

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

  // ✅ auth UI
  isLoggedIn = false;
  userDisplayName = '';
  isUserMenuOpen = false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.checkScroll();
    this.refreshAuthState();
  }

  private refreshAuthState(): void {
    this.isLoggedIn = this.auth.isLoggedIn();
    const user = this.auth.getUser();

    // si tu as user => nom prenom ; sinon fallback
    this.userDisplayName = user?.prenom
      ? `${user.prenom} ${user.nom ?? ''}`.trim()
      : (user?.email ?? 'Utilisateur');
  }

  /** Détecte le scroll */
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkScroll();
  }

  private checkScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Recherche:', this.searchQuery);
    }
  }

  onSearchFocus(): void { this.isSearchFocused = true; }
  onSearchBlur(): void { this.isSearchFocused = false; }
  clearSearch(): void { this.searchQuery = ''; }

  toggleMobileMenu(): void { this.isMobileMenuOpen = !this.isMobileMenuOpen; }
  closeMobileMenu(): void { this.isMobileMenuOpen = false; }

  // ✅ User menu
  toggleUserMenu(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  @HostListener('document:click')
  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  logout(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();

    this.auth.logout();
    this.refreshAuthState();
    this.isUserMenuOpen = false;
    this.closeMobileMenu();

    this.router.navigate(['/login']);
  }
}
