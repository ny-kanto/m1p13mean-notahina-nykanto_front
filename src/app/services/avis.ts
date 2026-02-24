import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApiResponse, PaginatedResponse } from '../interface/api-response';
import { AvisApi, EntityType } from '../interface/avis';

@Injectable({ providedIn: 'root' })
export class AvisService {
  private apiUrl = 'http://localhost:3000/avis';
//   private apiUrl = 'https://m1p13mean-notahina-nykanto-back.onrender.com/avis';

  constructor(private http: HttpClient) {}

  getAvisForEntity(
    entityType: EntityType,
    entityId: string,
    page = 1,
    limit = 10,
  ): Observable<PaginatedResponse<AvisApi>> {
    const params = new HttpParams().set('page', String(page)).set('limit', String(limit));
    return this.http
      .get<PaginatedResponse<AvisApi>>(`${this.apiUrl}/${entityType}/${entityId}`, { params })
      .pipe(catchError(this.handleError));
  }

  upsertAvis(payload: {
    entityType: EntityType;
    entityId: string;
    note: number;
    commentaire?: string;
  }): Observable<ApiResponse<AvisApi>> {
    return this.http
      .post<ApiResponse<AvisApi>>(`${this.apiUrl}`, {
        ...payload,
        note: Number(payload.note),
        commentaire: payload.commentaire ?? '',
      })
      .pipe(catchError(this.handleError));
  }

  deleteAvis(avisId: string): Observable<{ success: boolean; message?: string }> {
    return this.http
      .delete<{ success: boolean; message?: string }>(`${this.apiUrl}/${avisId}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    const msg =
      error.error?.message ??
      (error.error instanceof ErrorEvent
        ? error.error.message
        : `HTTP ${error.status} - ${error.message}`);
    console.error('[AvisService]', msg);
    return throwError(() => new Error(msg));
  }
}
