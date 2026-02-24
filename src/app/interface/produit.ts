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
  noteMoyenne?: number;
  noteCompte?: number;
}

export interface ProduitApi {
  _id?: string;
  nom: string;
  prix: number;
  description: string;
  boutique: string; // champ réel du backend
  images: { url: string; public_id: string }[];
  noteMoyenne?: number;
  noteCompte?: number;
}
