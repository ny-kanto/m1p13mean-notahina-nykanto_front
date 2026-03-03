// home-v2.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderHomeComponent } from '../header-home/header-home';
import { Footer } from '../footer/footer';
import { HomeService } from '../../services/home';
import { forkJoin, Subject, takeUntil } from 'rxjs';

type HeroSlide = {
  title: string;
  subtitle: string;
  image: string;
  buttonText: string;
  buttonLink: any[] | string;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderHomeComponent, Footer],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  boutiquesFeatured: any[] = [];

  // ✅ Hero: slides dynamiques depuis promotionsActives
  currentSlide = 0;

  // ✅ NOUVEAU : feed backend
  evenementsActifs: any[] = [];
  promotionsActives: any[] = [];
  isLoadingHomeFeed = false;
  homeFeedError = '';

  private destroy$ = new Subject<void>();
  private intervalId: any;

  constructor(private homeApi: HomeService) {}

  // ✅ 4 events max
  get evenementsHome(): any[] {
    return (this.evenementsActifs || []).slice(0, 4);
  }

  get eventLarge(): any | null {
    return this.evenementsHome.length ? this.evenementsHome[0] : null;
  }

  get eventsSmall(): any[] {
    return this.evenementsHome.slice(1);
  }

  // ✅ Slides hero = promotions actives (max 5)
  get heroSlides(): HeroSlide[] {
    const promos = (this.promotionsActives || []).filter((p: any) => this.isPromoDisplayable(p));

    const slides = promos.slice(0, 5).map((p: any) => ({
      title: `-${p.pourcentage}% • ${p.boutique?.nom ?? 'Boutique'}`,
      subtitle: p.titre ?? 'Promotion en cours',
      image:
        p.boutique?.image?.url ||
        p.image?.url || // au cas où tu ajoutes image promo plus tard
        'https://via.placeholder.com/1920x900?text=Promotion',
      buttonText: 'Voir la promotion',
      buttonLink: ['/promotions'],
      // alternative: buttonLink: p.boutique?._id ? ['/boutiques', p.boutique._id] : ['/promotions']
    }));

    if (!slides.length) {
      return [
        {
          title: 'AKOOR SHOPPING',
          subtitle: 'Découvrez nos boutiques et nos événements',
          image: 'https://via.placeholder.com/1920x900?text=AKOOR+SHOPPING',
          buttonText: 'Voir les boutiques',
          buttonLink: ['/boutiques'],
        },
      ];
    }

    return slides;
  }

  get heroSlidesCount(): number {
    return this.heroSlides.length;
  }

  private isPromoDisplayable(p: any): boolean {
    return !!p && typeof p.pourcentage === 'number' && !!p.titre;
  }

  nextSlide(): void {
    const n = this.heroSlidesCount;
    if (n <= 1) return;
    this.currentSlide = (this.currentSlide + 1) % n;
  }

  previousSlide(): void {
    const n = this.heroSlidesCount;
    if (n <= 1) return;
    this.currentSlide = (this.currentSlide - 1 + n) % n;
  }

  goToSlide(index: number): void {
    const n = this.heroSlidesCount;
    if (n === 0) return;
    this.currentSlide = Math.max(0, Math.min(index, n - 1));
  }

  // Scroll du carousel de boutiques
  scrollShops(direction: 'left' | 'right'): void {
    const container = document.querySelector('.shops-carousel');
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  }

  ngOnInit(): void {
    // ✅ 1) Auto-rotation hero
    this.intervalId = setInterval(() => this.nextSlide(), 5000);

    // ✅ 2) Charger événements + promotions + boutiques featured
    this.isLoadingHomeFeed = true;

    forkJoin({
      ev: this.homeApi.getEvenementsActifs(),
      pr: this.homeApi.getPromotionsActives(),
      bt: this.homeApi.getBoutiquesFeatured(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ ev, pr, bt }) => {
          this.evenementsActifs = ev?.data || [];
          this.promotionsActives = pr?.data || [];

          // 👇 on limite à 7 boutiques
          this.boutiquesFeatured = (bt?.data || []).slice(0, 7);

          // ✅ reset slide quand les promos arrivent
          this.currentSlide = 0;

          this.isLoadingHomeFeed = false;
        },
        error: (err) => {
          this.homeFeedError = err?.message || 'Erreur chargement home feed';
          this.isLoadingHomeFeed = false;
        },
      });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
