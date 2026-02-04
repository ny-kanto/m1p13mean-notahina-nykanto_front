export interface ProduitFiltre {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  stockStatus?: 'all' | 'empty' | 'low' | 'ok';
  sortBy?: 'nom' | 'prix' | 'stock';
  sortOrder?: 'asc' | 'desc';
}
