export interface BoutiqueFiltre {
  search?: string;
  categorie?: string;
  etage?: string;
  ouvert?: boolean | string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}
