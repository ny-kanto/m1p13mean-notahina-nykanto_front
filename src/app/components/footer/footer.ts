import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  currentYear = new Date().getFullYear();

  // Vos noms complets
  students = [
    { name: 'Notahina ANDRIAMANANJARA', role: 'Développeur Frontend & Backend' },
    { name: 'Ny Kanto RANDRIAMBOLOLONA', role: 'Développeur Frontend & Backend' },
  ];

  // Liens utiles
  quickLinks = [
    { label: 'À propos', route: '/about' },
    { label: 'Contact', route: '/contact' },
    { label: 'FAQ', route: '/faq' },
    { label: 'Mentions légales', route: '/legal' },
  ];

  // Réseaux sociaux
  socialLinks = [
    { icon: 'fab fa-facebook', url: '#', label: 'Facebook' },
    { icon: 'fab fa-twitter', url: '#', label: 'Twitter' },
    { icon: 'fab fa-instagram', url: '#', label: 'Instagram' },
    { icon: 'fab fa-linkedin', url: '#', label: 'LinkedIn' },
  ];
}
