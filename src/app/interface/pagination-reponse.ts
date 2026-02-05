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
