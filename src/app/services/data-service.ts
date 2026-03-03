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

  // 🔹 Pour le chemin à tracer dans le SVG
  private pathSubject = new BehaviorSubject<string | undefined>(undefined);
  path$ = this.pathSubject.asObservable();

  changePath(path: string | undefined) {
    this.pathSubject.next(path);
  }

  private pathEtage1Subject = new BehaviorSubject<string | undefined>(undefined);
  pathEtage1$ = this.pathEtage1Subject.asObservable();

  changePathEtage1(path: string | undefined) {
    this.pathEtage1Subject.next(path);
  }

}
