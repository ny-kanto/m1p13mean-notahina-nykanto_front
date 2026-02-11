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
  };
  filters: BoutiqueFiltre;
}
