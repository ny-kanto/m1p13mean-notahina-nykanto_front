import { Component } from '@angular/core';
import { BoutiqueService } from '../../services/boutique';
import { Boutique } from '../../interface/boutique';
import { FloorRdcComponent } from './floors/floor-rdc/floor-rdc';
import { FloorEtage1Component } from './floors/floor-etage1/floor-etage1';
import { Zone } from '../../interface/zone';
import { ZoneService } from '../../services/zone';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaginationReponse1 } from '../../interface/pagination-reponse';

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
  paginationResponse?: PaginationReponse1<Boutique>;

  selectedZone?: Zone;
  selectedBoutiqueId: string = '';

  currentFloor = 0;
  activeStore?: Boutique;

  constructor(
    private zoneService: ZoneService,
    private boutiqueService: BoutiqueService
  ) {
    this.zoneService.getZones().subscribe(z => this.zones = z);
    this.boutiqueService.getBoutiques().subscribe(b => {this.paginationResponse = b;
      this.boutiques = this.paginationResponse?.data || [];
    });
  }

  onZoneClick(zoneId: string) {
    this.selectedZone = this.zones.find(z => z.zoneId === zoneId);
    this.selectedBoutiqueId = this.selectedZone?.boutiqueId?._id || '';
  }

  save() {
    if (!this.selectedZone) {
      console.log('NO ZONE SELECTED DANS SAVE');
      return;
    }

    console.log('TAFIDITRA SAVE', this.selectedZone.zoneId, this.selectedBoutiqueId);

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