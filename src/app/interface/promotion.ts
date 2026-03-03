// src/app/interfaces/promotion.ts

export interface ImageRef {
  url: string;
  public_id?: string;
}

export interface BoutiqueRef {
  _id: string;
  nom: string;
  image?: ImageRef;
}

export interface EvenementRef {
  _id: string;
  titre: string;
}

export type PromotionScope = 'ALL_PRODUCTS' | 'PRODUCTS';

export interface Promotion {
  _id: string;

  boutique: BoutiqueRef; // populate côté backend (sinon adapte en string)
  event?: EvenementRef | null;

  titre: string;
  description?: string;

  pourcentage: number;

  dateDebut: string | Date;
  dateFin: string | Date;

  scope: PromotionScope;
  productIds: string[];

  createdBy: string;
  created_at?: string | Date;

  // virtual
  isActive?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  totalItems?: number;
  totalPages?: number;
  page?: number;
  limit?: number;
}
