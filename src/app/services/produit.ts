import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Produit } from '../interface/produit';
import { PaginationReponse } from '../interface/pagination-reponse';
import { ProduitFiltre } from '../interface/produit-filtre';

@Injectable({
  providedIn: 'root',
})
export class ProduitService {
  private apiUrl = 'https://m1p13mean-notahina-nykanto-back.onrender.com/produits';

  constructor(private http: HttpClient) {}

  /**
   * Récupérer les produits d'une boutique avec pagination et filtres
   */
  getProductsByBoutique(
    boutiqueId: string,
    page: number = 1,
    limit: number = 10,
    filters?: ProduitFiltre,
  ): Observable<PaginationReponse> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    // Ajouter les filtres s'ils sont définis
    if (filters) {
      if (filters.search && filters.search.trim()) {
        params = params.set('search', filters.search.trim());
      }

      if (filters.minPrice !== undefined && filters.minPrice !== null) {
        params = params.set('minPrice', filters.minPrice.toString());
      }

      if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
        params = params.set('maxPrice', filters.maxPrice.toString());
      }

      if (filters.stockStatus && filters.stockStatus !== 'all') {
        params = params.set('stockStatus', filters.stockStatus);
      }

      if (filters.sortBy) {
        params = params.set('sortBy', filters.sortBy);
      }

      if (filters.sortOrder) {
        params = params.set('sortOrder', filters.sortOrder);
      }
    }

    return this.http.get<PaginationReponse>(`${this.apiUrl}/boutique/${boutiqueId}`, { params });
  }

  /**
   * Récupérer un produit par ID
   */
  getProductById(id: string): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * Créer un nouveau produit
   */
  createProduct(formData: FormData): Observable<Produit> {
    return this.http.post<Produit>(this.apiUrl, formData).pipe(catchError(this.handleError));
  }

  /**
   * Mettre à jour un produit
   */
  updateProduct(id: string, product: Partial<Produit>): Observable<Produit> {
    return this.http
      .put<Produit>(`${this.apiUrl}/${id}`, product)
      .pipe(catchError(this.handleError));
  }

  /**
   * Supprimer un produit
   */
  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  /**
   * Gestion des erreurs
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
