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
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-mall-map',
  standalone: true,
  imports: [FloorRdcComponent, FloorEtage1Component, FormsModule, CommonModule],
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

  constructor(
    private zoneService: ZoneService,
    private boutiqueService: BoutiqueService,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService
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
  }

  onBoutiqueChange(event: any){

    console.log('ON BOUTIQUE CHANGE');

    this.selectedBoutiqueId = event.target.value;

    this.activeStore = this.boutiques.find(b => b._id === this.selectedBoutiqueId);

    console.log('ACTIVE STORE : ', this.activeStore);
  }

  save() {
    if (!this.selectedZone) {
      console.log('NO ZONE SELECTED DANS SAVE');
      return;
    }

    console.log('TAFIDITRA SAVE', this.selectedZone.zoneId, this.selectedBoutiqueId);

    this.updateBoutique();

    this.zoneService.assignZone(
      this.selectedZone.zoneId,
      this.selectedBoutiqueId || null
    ).subscribe({
      next: updatedZone => {
        console.log('Zone mise à jour depuis le serveur :', updatedZone);

        // Mettre à jour localement la zone
        const index = this.zones.findIndex(z => z.zoneId === updatedZone.zoneId);
        if (index !== -1) this.zones[index] = updatedZone;

        // Réinitialiser la sélection
        this.selectedZone = undefined;
        this.selectedBoutiqueId = '';
      },
      error: err => {
        console.error('Erreur lors de l\'assignation de la zone :', err);
      }
    });
  }

  /**
  * UPDATE
  */
  updateBoutique(): void {
    if (!this.activeStore?._id) return;

    const formData = this.buildFormData();

    console.log('FormData à envoyer :' , Array.from(formData.entries()));

    this.boutiqueService
      .updateBoutique(this.activeStore._id, formData)
      .subscribe({
        next: () => {
          alert('✅ Boutique modifiée');
        },
        error: (err) => {
          console.error('Erreur lors de la modification de la boutique :', err);
        },
      });
  }

  buildFormData(): FormData {
    const fd = new FormData();

    if (!this.activeStore) {
      return fd;
    }

    fd.append('etage', this.currentFloor.toString());

    return fd;
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

}