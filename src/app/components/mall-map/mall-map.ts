import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BoutiqueService } from '../../services/boutique';
import { Boutique } from '../../interface/boutique';
import { FloorRdcComponent } from './floors/floor-rdc/floor-rdc';
import { FloorEtage1Component } from './floors/floor-etage1/floor-etage1';
import { Zone } from '../../interface/zone';
import { ZoneService } from '../../services/zone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaginationReponse, PaginationReponse1 } from '../../interface/pagination-reponse';
import { DataService } from '../../services/data-service';
import { forkJoin } from 'rxjs';
import { RDC_NAVIGATION_MAP } from '../../interface/rdc-navigation-map';
import { PathfindingService } from '../../services/pathfinding-service';
import { HeaderHomeComponent } from "../header-home/header-home";
import { Footer } from "../footer/footer";

interface PathPoint {
  x: number;
  y: number;
  floor: number; // 0 = RDC, 1 = étage 1
}

@Component({
  selector: 'app-mall-map',
  standalone: true,
  imports: [FloorRdcComponent, FloorEtage1Component, FormsModule, CommonModule, HeaderHomeComponent, Footer],
  templateUrl: './mall-map.html',
  styleUrls: ['./mall-map.css'],
})
export class MallMapComponent {

  zones: Zone[] = [];
  boutiques: Boutique[] = [];
  paginationResponse?: PaginationReponse<Boutique>;

  selectedZone?: Zone;
  selectedBoutiqueId: string = '';

  currentFloor = 0;
  activeStore?: Boutique;

  zoneTrouvee?: Zone ;

  paramId?: string;
  paramEtage?: string;

  showRouteModal = false;

  routeStart: string | null = null;
  routeEnd: string | null = null;

  // ⚡ Nouveau : chemins à afficher sur SVG
  pathRdc: PathPoint[] = [];
  pathEtage1: PathPoint[] = [];

  private boutiqueToDoor: Record<string, string> = {
    // RDC
    'shop-101': 'door-101',
    'shop-102': 'door-102',
    'shop-103': 'door-103',
    'shop-201': 'door-201',
    'shop-202': 'door-202',
    'store-hyper': 'door-hyper',

    // Étage 1
    'shop-301': 'door-301',
    'shop-302': 'door-302',
    'shop-303': 'door-303',
    'food-court': 'door-food-court'
  };

  private getDoorNodeFromBoutiqueId(boutiqueId: string): string | null {

    const zone = this.zones.find(z => z.boutiqueId?._id === boutiqueId);
    if (!zone) return null;

    return this.boutiqueToDoor[zone.zoneId] ?? null;
  }


  constructor(
    private zoneService: ZoneService,
    private boutiqueService: BoutiqueService,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private pathfindingService: PathfindingService
  ) {}

  sendData(boutiqueId?: string) {
      this.zones.map(zone => {
        if (zone.boutiqueId?._id === boutiqueId) {
          this.zoneTrouvee = zone;
        }
      });
      console.log("ZONE TROUVEE : ", this.zoneTrouvee);

      this.dataService.changeData(this.zoneTrouvee);
  }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {

      this.paramId = params['boutiqueId'];
      this.paramEtage = params['etage'];

      this.currentFloor = this.paramEtage ? parseInt(this.paramEtage, 10) : 0;
      console.log("CURRENT FLOOR DANS MALL MAP : ", this.currentFloor);

    });

    forkJoin({
      zones: this.zoneService.getZones(),
      boutiques: this.boutiqueService.getAllBoutiques()
    }).subscribe(({ zones, boutiques }) => {

      console.log("BOUTIQUES DANS MALL MAP : ", boutiques);
      this.zones = zones;
      this.boutiques = boutiques.data;

      this.sendData(this.paramId);

    });

  }



  onZoneClick(zoneId: string) {
    this.selectedZone = this.zones.find(z => z.zoneId === zoneId);
    this.selectedBoutiqueId = this.selectedZone?.boutiqueId?._id || '';
    this.activeStore = this.boutiques.find(b => b._id === this.selectedBoutiqueId);
    if (zoneId === 'stairs-up') {
      this.currentFloor = 1;
    }else if (zoneId === 'stairs-down') {
      this.currentFloor = 0;
    }
  }

  getBoutiqueName(zoneId: string): string {
    const zone = this.zones.find(z => z.zoneId === zoneId);
    const b = zone?.boutiqueId
      ? this.boutiques.find(bt => bt._id === zone.boutiqueId?._id)
      : undefined;
    return b?.nom ?? 'Libre';
  }

  onShopClick(id: string) {

    if (id === 'stairs-up') {
      this.currentFloor = 1;
      this.activeStore = undefined;
      return;
    }

    if (id === 'stairs-down') {
      this.currentFloor = 0;
      this.activeStore = undefined;
      return;
    }

  }

  openRouteModal() {
    this.showRouteModal = true;
  }

  closeRouteModal() {
    this.showRouteModal = false;
  }

  /** 🔹 Calculer l’itinéraire entre deux boutiques */
  calculateRoute() {
    if (!this.routeStart || !this.routeEnd) return;

    const startNode = this.getDoorNodeFromBoutiqueId(this.routeStart);
    const endNode = this.getDoorNodeFromBoutiqueId(this.routeEnd);

    if (!startNode || !endNode) {
      console.error('Impossible de trouver les portes correspondantes');
      return;
    }

    console.log('Route nodes:', startNode, '→', endNode);

    const path: PathPoint[] = this.pathfindingService.findPath(startNode, endNode);

    console.log('Chemin complet calculé :', path);

    const pathRdc = path
      .filter(p => p.floor === 0)
      .map(p => `${p.x},${p.y}`)
      .join(' ');

    const pathEtage1 = path
      .filter(p => p.floor === 1)
      .map(p => `${p.x},${p.y}`)
      .join(' ');

    this.dataService.changePath(pathRdc);
    this.dataService.changePathEtage1(pathEtage1);

    this.closeRouteModal();
  }

}