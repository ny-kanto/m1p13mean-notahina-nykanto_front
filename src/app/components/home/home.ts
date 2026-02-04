// home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {

  // Statistiques du centre
  stats = [
    { icon: 'fas fa-store', value: '150+', label: 'Boutiques', color: '#667eea' },
    { icon: 'fas fa-users', value: '50K+', label: 'Visiteurs/mois', color: '#f5576c' },
    { icon: 'fas fa-box', value: '10K+', label: 'Produits', color: '#11998e' },
    { icon: 'fas fa-star', value: '4.8', label: 'Note moyenne', color: '#f39c12' }
  ];

  // Catégories populaires
  categories = [
    {
      name: 'Mode & Vêtements',
      icon: 'fas fa-tshirt',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500',
      count: 45,
      color: '#667eea'
    },
    {
      name: 'Électronique',
      icon: 'fas fa-laptop',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
      count: 32,
      color: '#f5576c'
    },
    {
      name: 'Alimentation',
      icon: 'fas fa-shopping-basket',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
      count: 28,
      color: '#11998e'
    },
    {
      name: 'Beauté & Santé',
      icon: 'fas fa-spa',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500',
      count: 20,
      color: '#f39c12'
    },
    {
      name: 'Sports & Loisirs',
      icon: 'fas fa-football-ball',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500',
      count: 15,
      color: '#9b59b6'
    },
    {
      name: 'Maison & Déco',
      icon: 'fas fa-couch',
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500',
      count: 18,
      color: '#e74c3c'
    }
  ];

  // Boutiques populaires
  popularShops = [
    {
      name: 'Zara',
      category: 'Mode',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500',
      rating: 4.8,
      floor: 2
    },
    {
      name: 'Jumbo Score',
      category: 'Alimentation',
      image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=500',
      rating: 4.9,
      floor: 1
    },
    {
      name: 'Samsung Experience',
      category: 'Électronique',
      image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500',
      rating: 4.7,
      floor: 3
    },
    {
      name: 'Sephora',
      category: 'Beauté',
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500',
      rating: 4.9,
      floor: 2
    }
  ];

  // Promotions en cours
  promotions = [
    {
      title: 'Soldes d\'été',
      description: 'Jusqu\'à -70% sur une sélection de produits',
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800',
      badge: '-70%',
      color: '#e74c3c'
    },
    {
      title: 'Black Friday',
      description: 'Des offres exceptionnelles sur l\'électronique',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
      badge: 'HOT',
      color: '#f39c12'
    },
    {
      title: 'Nouvelle collection',
      description: 'Découvrez les dernières tendances mode',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
      badge: 'NEW',
      color: '#667eea'
    }
  ];

  // Services du centre
  services = [
    { icon: 'fas fa-parking', title: 'Parking Gratuit', description: '2000 places disponibles' },
    { icon: 'fas fa-wifi', title: 'WiFi Gratuit', description: 'Dans tout le centre' },
    { icon: 'fas fa-child', title: 'Espace Enfants', description: 'Aire de jeux sécurisée' },
    { icon: 'fas fa-utensils', title: 'Restauration', description: '15 restaurants et cafés' },
    { icon: 'fas fa-wheelchair', title: 'Accessibilité', description: 'PMR & Familles' },
    { icon: 'fas fa-shield-alt', title: 'Sécurité 24/7', description: 'Gardiennage permanent' }
  ];

  // Index du slide actuel
  currentSlide = 0;

  ngOnInit(): void {
    // Auto-rotation des promotions
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.promotions.length;
  }

  previousSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.promotions.length) % this.promotions.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }
}
