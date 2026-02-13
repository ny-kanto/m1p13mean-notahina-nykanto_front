import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-floor-etage1',
  standalone: true,
  templateUrl: './floor-etage1.html',
})
export class FloorEtage1Component {
  @Output() shopClick = new EventEmitter<string>();

  onClick(id: string) {
    console.log('Etage1 click:', id); // 👈 DEBUG
    this.shopClick.emit(id);
  }
}
