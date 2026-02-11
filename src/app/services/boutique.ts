// boutique.service.ts (Angular - Frontend)
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BoutiqueFiltre } from '../interface/boutique-filtre';
import { PaginationReponse } from '../interface/pagination-reponse';
import { Boutique } from '../interface/boutique';
import { Categorie } from '../interface/categorie';

@Injectable({
  providedIn: 'root',
})
export class BoutiqueService {
  private apiUrl = 'http://localhost:3000/boutiques';
  private categoriesUrl = 'http://localhost:3000/categories';

  constructor(private http: HttpClient) {}

  /**
   * Récupérer toutes les boutiques avec pagination et filtres
   */
  getAllBoutiques(
    filters: BoutiqueFiltre = {},
    page: number = 1,
    limit: number = 12, // cohérent avec le backend
  ): Observable<PaginationReponse<Boutique>> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters.search) {
      params = params.set('search', filters.search);
    }

    if (filters.categorie) {
      params = params.set('categorie', filters.categorie);
    }

    if (filters.etage !== undefined && filters.etage !== '') {
      params = params.set('etage', filters.etage);
    }

    if (filters.ouvert !== undefined && filters.ouvert !== '') {
      params = params.set('ouvert', String(filters.ouvert));
    }

    if (filters.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }

    if (filters.order) {
      params = params.set('order', filters.order);
    }

    return this.http.get<PaginationReponse<Boutique>>(this.apiUrl, { params });
  }

  getBoutiqueById(id: string): Observable<{ success: boolean; data: Boutique }> {
    return this.http.get<{ success: boolean; data: Boutique }>(
      `${this.apiUrl}/${id}`
    );
  }

  createBoutique(
    formData: FormData,
  ): Observable<{ success: boolean; data: Boutique; message: string }> {
    return this.http.post<{ success: boolean; data: Boutique; message: string }>(
      this.apiUrl,
      formData
    );
  }

  updateBoutique(
    id: string,
    formData: FormData,
  ): Observable<{ success: boolean; data: Boutique; message: string }> {
    return this.http.put<{ success: boolean; data: Boutique; message: string }>(
      `${this.apiUrl}/${id}`,
      formData
    );
  }

  deleteBoutique(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiUrl}/${id}`
    );
  }

  searchBoutiques(
    criteria: any,
  ): Observable<{ success: boolean; data: Boutique[]; count: number }> {
    return this.http.post<{ success: boolean; data: Boutique[]; count: number }>(
      `${this.apiUrl}/search`,
      criteria
    );
  }

  getAllCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.categoriesUrl);
  }
}
