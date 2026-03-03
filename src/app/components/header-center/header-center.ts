import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header-center',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-center.html',
  styleUrl: './header-center.css',
})
export class HeaderCenterComponent {
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

    this.isLoggedIn = this.auth.isLoggedIn();

    const user = this.auth.getUser?.();
    this.userDisplayName = user?.nom + " " + user?.prenom || '';
  }

  /** Détecte le scroll */
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkScroll();
  }

  private checkScroll(): void {
    const scrollPosition =
      window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isScrolled = scrollPosition > 50;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  @HostListener('document:click')
  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  // ✅ User menu
  toggleUserMenu(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  logout(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();

    this.auth.logout();
    this.isUserMenuOpen = false;
    this.closeMobileMenu();

    this.router.navigate(['/login']);
  }
}
