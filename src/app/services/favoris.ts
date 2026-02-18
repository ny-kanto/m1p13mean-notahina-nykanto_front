// services/favoris.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FavorisService {
  private api = 'https://m1p13mean-notahina-nykanto-back.onrender.com/favoris';
//   private api = 'http://localhost:3000/favoris';

  constructor(private http: HttpClient) {}

  getFavoris() {
    return this.http.get<any>(this.api);
  }

  toggleBoutique(boutiqueId: string) {
    return this.http.post<any>(`${this.api}/boutiques/${boutiqueId}/toggle`, {});
  }

  toggleProduit(produitId: string) {
    return this.http.post<any>(`${this.api}/produits/${produitId}/toggle`, {});
  }

  /**
   * Vérifier si une boutique est dans les favoris de l'utilisateur
   * GET /favoris/boutiques/:id/check
   */
  isFavori(boutiqueId: string): Observable<{ isFavori: boolean }> {
    return this.http.get<{ isFavori: boolean }>(
      `${this.api}/boutiques/${boutiqueId}/check`,
    );
  }

  /**
   * Récupérer tous les IDs favoris (pour initialiser plusieurs cards d'un coup)
   * GET /favoris/boutiques/ids
   */
  getFavorisIds(): Observable<string[]> {
    return this.http.get<string[]>(`${this.api}/boutiques/ids`);
  }
}
