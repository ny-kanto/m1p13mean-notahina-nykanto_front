import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Boutique } from '../interface/boutique';

@Injectable({
  providedIn: 'root'
})
export class BoutiqueService {
  private apiUrl = 'http://localhost:3000/boutiques';

  constructor(private http: HttpClient) { }

  /**
   * Récupérer toutes les boutiques
   */
  getBoutiques(): Observable<Boutique[]> {
    return this.http.get<Boutique[]>(this.apiUrl).pipe(
      retry(2), // Réessaye 2 fois en cas d'erreur
      catchError(this.handleError)
    );
  }

  /**
   * Récupérer une boutique par ID
   */
  getBoutiqueById(id: string): Observable<Boutique> {
    return this.http.get<Boutique>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Filtrer les boutiques par catégorie
   */
  getBoutiquesByCategorie(categorie: string): Observable<Boutique[]> {
    return this.http.get<Boutique[]>(`${this.apiUrl}?categorie=${categorie}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Filtrer les boutiques par étage
   */
  getBoutiquesByEtage(etage: number): Observable<Boutique[]> {
    return this.http.get<Boutique[]>(`${this.apiUrl}?etage=${etage}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Créer une nouvelle boutique
   */
  createBoutique(boutique: Boutique): Observable<Boutique> {
    return this.http.post<Boutique>(this.apiUrl, boutique).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Mettre à jour une boutique
   */
  updateBoutique(id: string, boutique: Partial<Boutique>): Observable<Boutique> {
    return this.http.put<Boutique>(`${this.apiUrl}/${id}`, boutique).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Supprimer une boutique
   */
  deleteBoutique(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Gestion des erreurs HTTP
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code d'erreur: ${error.status}\nMessage: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
