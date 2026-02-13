import { Boutique } from "./boutique";
import { Produit } from "./produit";
import { ProduitFiltre } from "./produit-filtre";

export interface PaginationReponse {
  page: number;
  limit: number;
  skip: number;
  data: Produit[];
  totalPages: number;
  totalItems: number;
  appliedFilters?: ProduitFiltre;
}

export interface PaginationReponse1<T> {
  page: number;
  limit: number;
  skip: number;
  data: T[];
  totalPages: number;
  totalItems: number;
}