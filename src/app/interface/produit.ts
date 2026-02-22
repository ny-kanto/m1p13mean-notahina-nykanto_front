export interface Produit {
  _id?: string;
  nom: string;
  prix: number;
  description: string;
  boutiqueId: string;
  images: {
    url: string;
    public_id: string;
  }[];
}
