import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Produit, ProduitApi } from '../interface/produit';
import { PaginationReponse } from '../interface/pagination-reponse';
import { ProduitFiltre } from '../interface/produit-filtre';

@Injectable({ providedIn: 'root' })
export class ProduitService {
  private apiUrl = 'http://localhost:3000/produits';
  // private apiUrl = 'https://m1p13mean-notahina-nykanto-back.onrender.com/produits';

  constructor(private http: HttpClient) {}

  private mapProduit(p: ProduitApi): Produit {
    return {
      _id: p._id,
      nom: p.nom,
      prix: p.prix,
      description: p.description ?? '',
      boutiqueId: p.boutique, // ✅ clé du fix
      images: p.images ?? [],
    };
  }

  private mapPagination(res: PaginationReponse<ProduitApi>): PaginationReponse<Produit> {
    return {
      ...res,
      data: (res.data ?? []).map((p) => this.mapProduit(p)),
    };
  }

  getProductsByBoutique(
    boutiqueId: string,
    page: number = 1,
    limit: number = 12,
    filters?: ProduitFiltre,
  ): Observable<PaginationReponse<Produit>> {
    let params = new HttpParams().set('page', String(page)).set('limit', String(limit));

    if (filters?.search?.trim()) params = params.set('search', filters.search.trim());
    if (filters?.minPrice != null) params = params.set('minPrice', String(filters.minPrice));
    if (filters?.maxPrice != null) params = params.set('maxPrice', String(filters.maxPrice));
    if (filters?.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters?.sortOrder) params = params.set('sortOrder', filters.sortOrder);

    return this.http
      .get<PaginationReponse<ProduitApi>>(`${this.apiUrl}/boutique/${boutiqueId}`, { params })
      .pipe(
        map((res) => this.mapPagination(res)),
        catchError(this.handleError),
      );
  }

  getProductById(id: string): Observable<Produit> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map((raw) => {
        console.log('RAW API RESPONSE:', raw);

        // si ton API renvoie { data: produit } ou { produit: produit }
        const p = raw?.data ?? raw?.produit ?? raw;

        return this.mapProduit(p as ProduitApi);
      }),
      catchError(this.handleError),
    );
  }

  createProduct(formData: FormData): Observable<Produit> {
    return this.http.post<ProduitApi>(this.apiUrl, formData).pipe(
      map((p) => this.mapProduit(p)),
      catchError(this.handleError),
    );
  }

  updateProduct(id: string, payload: Partial<Produit>): Observable<Produit> {
    // ⚠️ payload a boutiqueId, backend attend boutique
    const body: any = { ...payload };
    if (body.boutiqueId) {
      body.boutique = body.boutiqueId;
      delete body.boutiqueId;
    }

    return this.http.put<ProduitApi>(`${this.apiUrl}/${id}`, body).pipe(
      map((p) => this.mapProduit(p)),
      catchError(this.handleError),
    );
  }

  deleteProduct(id: string): Observable<{ success?: boolean; message?: string }> {
    return this.http
      .delete<{ success?: boolean; message?: string }>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Optionnel si tu as une route /produits/search
  searchProducts(criteria: any): Observable<PaginationReponse<Produit>> {
    return this.http.post<PaginationReponse<ProduitApi>>(`${this.apiUrl}/search`, criteria).pipe(
      map((res) => this.mapPagination(res)),
      catchError(this.handleError),
    );
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
