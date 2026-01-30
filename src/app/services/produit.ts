import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Produit } from '../interface/produit';

@Injectable({
  providedIn: 'root',
})
export class ProduitService {
  private apiUrl = 'http://localhost:3000/produits';

  constructor(private http: HttpClient) {}

  /**
   * Récupérer les produits d'une boutique
   */
  getProductsByBoutique(boutiqueId: string): Observable<Produit[]> {
    return this.http
      .get<Produit[]>(`${this.apiUrl}/boutique/${boutiqueId}`)
      .pipe(catchError(this.handleError));
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
