import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Zone } from '../interface/zone';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  
  private dataSubject = new BehaviorSubject<Zone | undefined>(undefined);

  data$ = this.dataSubject.asObservable();

  changeData(zone: Zone | undefined) {
    this.dataSubject.next(zone);
  }

}
