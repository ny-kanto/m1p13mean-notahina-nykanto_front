export interface ProduitFiltre {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'nom' | 'prix';
  sortOrder?: 'asc' | 'desc';
}
