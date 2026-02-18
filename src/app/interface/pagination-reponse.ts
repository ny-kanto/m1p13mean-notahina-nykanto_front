
import { Boutique } from "./boutique";
import { Produit } from "./produit";
import { ProduitFiltre } from "./produit-filtre";
import { BoutiqueFiltre } from "./boutique-filtre";

export interface PaginationReponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
    totalItems: number;
  };
  filters: BoutiqueFiltre;
}

export interface PaginationReponse1<T> {
  page: number;
  limit: number;
  skip: number;
  data: T[];
  totalPages: number;
  totalItems: number;
}