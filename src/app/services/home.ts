import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class HomeService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getEvenementsActifs(): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/evenements/actifs`)
      .pipe(catchError(this.handleError));
  }

  getPromotionsActives(params?: { boutique?: string; event?: string }): Observable<any> {
    let httpParams = new HttpParams();
    if (params?.boutique) httpParams = httpParams.set('boutique', params.boutique);
    if (params?.event) httpParams = httpParams.set('event', params.event);

    return this.http
      .get(`${this.baseUrl}/promotions/actives`, { params: httpParams })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    const msg =
      error.error?.message ??
      (error.error instanceof ErrorEvent
        ? error.error.message
        : `HTTP ${error.status} - ${error.message}`);
    return throwError(() => new Error(msg));
  }

  getBoutiquesFeatured() {
  return this.http.get<any>('http://localhost:3000/boutiques');
}
}
