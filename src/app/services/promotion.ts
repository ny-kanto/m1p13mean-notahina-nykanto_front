// src/app/services/promotion.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Promotion } from '../interface/promotion';

type Query = Record<string, any>;

@Injectable({ providedIn: 'root' })
export class PromotionService {
  private apiUrl = 'http://localhost:3000/promotions';
  // private apiUrl = 'https://m1p13mean-notahina-nykanto-back.onrender.com/promotions';

  constructor(private http: HttpClient) {}

  getAllPromotions(query: Query = {}): Observable<ApiResponse<Promotion[]>> {
    let params = new HttpParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
    });

    return this.http.get<ApiResponse<Promotion[]>>(this.apiUrl, { params });
  }

  getPromotionsActives(query: Query = {}): Observable<ApiResponse<Promotion[]>> {
    let params = new HttpParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
    });

    return this.http.get<ApiResponse<Promotion[]>>(`${this.apiUrl}/actives`, { params });
  }

  getPromotionById(id: string): Observable<ApiResponse<Promotion>> {
    return this.http.get<ApiResponse<Promotion>>(`${this.apiUrl}/${id}`);
  }

  createPromotion(payload: Partial<Promotion>): Observable<ApiResponse<Promotion>> {
    return this.http.post<ApiResponse<Promotion>>(this.apiUrl, payload);
  }

  updatePromotion(id: string, payload: Partial<Promotion>): Observable<ApiResponse<Promotion>> {
    return this.http.put<ApiResponse<Promotion>>(`${this.apiUrl}/${id}`, payload);
  }

  deletePromotion(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
