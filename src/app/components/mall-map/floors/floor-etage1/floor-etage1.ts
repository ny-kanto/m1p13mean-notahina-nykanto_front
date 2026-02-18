import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { Zone } from '../../../../interface/zone';
import { Boutique } from '../../../../interface/boutique';
import { ZoneService } from '../../../../services/zone';
import { BoutiqueService } from '../../../../services/boutique';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-floor-etage1',
  standalone: true,
  templateUrl: './floor-etage1.html',
})
export class FloorEtage1Component {
  @Output() zoneClick = new EventEmitter<string>();

  zones: Zone[] = [];
  boutiques: Boutique[] = [];
  zoneLabels: { [key: string]: string } = {};

  constructor(
      private zoneService: ZoneService,
      private boutiqueService: BoutiqueService,
      private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
      forkJoin({
        zones: this.zoneService.getZones(),
        boutiques: this.boutiqueService.getAllBoutiques()
      }).subscribe(({ zones, boutiques }) => {
  
        this.zones = zones;
        this.boutiques = boutiques.data; // si pagination
  
        console.log('Zones RDC:', this.zones);
        console.log('Boutiques RDC:', this.boutiques);
  
        this.buildLabels(); // ✅ ici
        
        this.cdr.detectChanges(); // 🔥 FORCE refresh
      });
  }

  onClick(zoneId: string) {
    this.zoneClick.emit(zoneId);
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
