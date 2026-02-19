export interface BoutiqueFiltre {
  search?: string;
  categorie?: string;
  etage?: string;
  ouvert?: boolean | string;
  favoris?: boolean | string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}
