import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ZoneService } from '../../../../services/zone';
import { Zone } from '../../../../interface/zone';
import { Boutique } from '../../../../interface/boutique';
import { BoutiqueService } from '../../../../services/boutique';
import { combineLatest, forkJoin } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { DataService } from '../../../../services/data-service';

@Component({
  selector: 'app-floor-rdc',
  standalone: true,
  templateUrl: './floor-rdc.html',
})
export class FloorRdcComponent {

  @Output() zoneClick = new EventEmitter<string>();

  zones: Zone[] = [];
  boutiques: Boutique[] = [];
  zoneLabels: { [key: string]: string } = {};
  receivedData: Zone | undefined;
  selectedZoneId?: string;    

  constructor(
      private zoneService: ZoneService,
      private boutiqueService: BoutiqueService,
      private cdr: ChangeDetectorRef,
      private dataService: DataService
  ) {}

  ngOnInit() {
    combineLatest([
      this.zoneService.getZones(),
      this.boutiqueService.getAllBoutiques(),
      this.dataService.data$
    ]).subscribe(([ zones, boutiques, receivedData ]) => {

      this.zones = zones;
      this.boutiques = boutiques.data; // si pagination
      this.receivedData = receivedData;
      this.selectedZoneId = receivedData?.zoneId;   // mémoriser l'identifiant

      // console.log('Zones RDC:', this.zones);
      // console.log('Boutiques RDC:', this.boutiques);
      // console.log('Data reçue ETAGE 0000000000 :', this.receivedData);

      this.buildLabels(); // ✅ ici
      
      this.cdr.detectChanges(); // 🔥 FORCE refresh
    });
  }

  onClick(zoneId: string) {
    this.zoneClick.emit(zoneId);
  }

  isSelected(zoneId: string): boolean {
    return zoneId === this.selectedZoneId;
  }

  private buildLabels() {

    const newLabels: { [key: string]: string } = {};

    for (let i = 0; i < this.zones.length; i++) {

      const zone = this.zones[i];

      if (!zone.boutiqueId) {
        newLabels[zone.zoneId] = 'Libre';
      } else {
        newLabels[zone.zoneId] = zone.boutiqueId.nom ?? 'Libre';
      }
    }

    this.zoneLabels = newLabels; // 🔥 nouvelle référence

    console.log('TAILLE DE ZONE LABEL:', this.zoneLabels);
  }

}