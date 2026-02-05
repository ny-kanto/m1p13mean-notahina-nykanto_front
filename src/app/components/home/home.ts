// home-v2.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderHomeComponent } from "../header-home/header-home";
import { Footer } from "../footer/footer";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderHomeComponent, Footer],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {

  // Slides du hero
  heroSlides = [
    {
      title: 'LA CARTE CADEAU',
      subtitle: 'Le cadeau parfait',
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=1920',
      buttonText: 'Je Découvre',
      buttonLink: '/carte-cadeau'
    },
    {
      title: 'REJOIGNEZ LE CLUB',
      subtitle: 'Pour bénéficier d\'offres exclusives',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920',
      buttonText: 'Devenir membre',
      buttonLink: '/club'
    },
    {
      title: 'SOLDES D\'ÉTÉ',
      subtitle: 'Jusqu\'à -70% dans vos boutiques préférées',
      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920',
      buttonText: 'Découvrir',
      buttonLink: '/promotions'
    }
  ];

  currentSlide = 0;

  // Boutiques populaires (carousel horizontal)
  featuredShops = [
    { name: 'ZARA', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800' },
    { name: 'PULL & BEAR', image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800' },
    { name: 'SEPHORA', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800' },
    { name: 'STARBUCKS', image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800' },
    { name: 'FNAC', image: 'https://images.unsplash.com/photo-1519558260268-cde7e03a0152?w=800' },
    { name: 'SAMSUNG', image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800' },
    { name: 'MANGO', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800' }
  ];

  // Services
  services = [
    {
      title: 'CARTE CADEAU',
      description: 'Une seule carte. Des possibilités infinies.',
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600',
      link: '/carte-cadeau',
      bgColor: 'white'
    },
    {
      title: 'WIFI GRATUIT',
      description: 'Restez connecté dans tout le centre.',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
      link: '/services',
      bgColor: 'black'
    },
    {
      title: 'PARKING GRATUIT',
      description: 'Encore une excuse pour faire des folies.',
      image: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600',
      link: '/parking',
      bgColor: '#de1c36'
    }
  ];

  // Actualités
  news = [
    {
      date: '25 janv. 2026',
      title: 'Nouvelle collection printemps-été',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600',
      link: '/actualites/1'
    },
    {
      date: '24 janv. 2026',
      title: 'Fêtez son anniversaire chez Akoor !',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600',
      link: '/actualites/2'
    },
    {
      date: '23 janv. 2026',
      title: 'Vous allez adorer les dimanches !',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600',
      link: '/actualites/3'
    }
  ];

  ngOnInit(): void {
    // Auto-rotation du hero
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
  }

  previousSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.heroSlides.length) % this.heroSlides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  // Scroll du carousel de boutiques
  scrollShops(direction: 'left' | 'right'): void {
    const container = document.querySelector('.shops-carousel');
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  }
}
