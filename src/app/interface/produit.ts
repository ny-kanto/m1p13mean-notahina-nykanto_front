export interface Produit {
  _id?: string;
  nom: string;
  prix: number;
  description: string;
  stock: number;
  boutiqueId: string;
  images?: string[];
}
