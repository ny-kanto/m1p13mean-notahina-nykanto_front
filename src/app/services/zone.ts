import { Injectable } from '@angular/core';
import { Zone } from '../interface/zone';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ZoneService {

    private apiUrl = 'https://m1p13mean-notahina-nykanto-back.onrender.com/zones';
    // private apiUrl = 'http://localhost:3000/zones';

    constructor(private http: HttpClient) {}

    getZones(): Observable<Zone[]> {
      return this.http.get<Zone[]>(this.apiUrl);
    }

    assignZone(zoneId: string, boutiqueId: string | null): Observable<Zone> {
      console.log(`TONGA ATO @ SERVICE SAVE DE Assigning zone ${zoneId} to boutique ${boutiqueId}`);
      return this.http.put<Zone>(
        `${this.apiUrl}/${zoneId}/assign`,
        { boutiqueId }
      );
    }

}
