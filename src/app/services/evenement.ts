import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiResponse, PaginatedResponse } from '../interface/api-response';
import { Evenement } from '../interface/evenement';

@Injectable({ providedIn: 'root' })
export class EvenementService {
  private apiUrl = 'http://localhost:3000/evenements';
  //   private apiUrl = 'https://m1p13mean-notahina-nykanto-back.onrender.com/evenements';

  constructor(private http: HttpClient) {}

  getAll(
    page = 1,
    limit = 10,
    filters?: { search?: string; actif?: string; sortBy?: string; order?: string },
  ) {
    let params = new HttpParams().set('page', String(page)).set('limit', String(limit));

    if (filters?.search?.trim()) params = params.set('search', filters.search.trim());
    if (filters?.actif) params = params.set('actif', filters.actif);
    if (filters?.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters?.order) params = params.set('order', filters.order);

    return this.http
      .get<PaginatedResponse<Evenement>>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  getById(id: string): Observable<ApiResponse<Evenement>> {
    return this.http
      .get<ApiResponse<Evenement>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  create(fd: FormData): Observable<ApiResponse<Evenement>> {
    return this.http
      .post<ApiResponse<Evenement>>(this.apiUrl, fd)
      .pipe(catchError(this.handleError));
  }

  update(id: string, fd: FormData): Observable<ApiResponse<Evenement>> {
    return this.http
      .put<ApiResponse<Evenement>>(`${this.apiUrl}/${id}`, fd)
      .pipe(catchError(this.handleError));
  }

  delete(id: string): Observable<ApiResponse<null>> {
    return this.http
      .delete<ApiResponse<null>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    const msg =
      error.error?.message ??
      (error.error instanceof ErrorEvent
        ? error.error.message
        : `HTTP ${error.status} - ${error.message}`);

    console.error(msg);
    return throwError(() => new Error(msg));
  }
}
