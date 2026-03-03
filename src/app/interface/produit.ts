export type PromotionLite = {
  _id: string;
  titre?: string;
  pourcentage: number;
  scope?: 'ALL_PRODUCTS' | 'PRODUCTS';
  event?: string | null;
};

export interface Produit {
  _id?: string;
  nom: string;

  // prix côté UI
  prix: number;          // (tu peux garder, mais on affichera prixFinal)
  prixOriginal?: number; // nouveau
  prixFinal?: number;    // nouveau
  promotion?: PromotionLite | null; // nouveau

  description: string;
  boutiqueId: string;
  images: { url: string; public_id: string }[];
  noteMoyenne?: number;
  noteCompte?: number;
}

export interface ProduitApi {
  _id?: string;
  nom: string;

  prix: number;               // champ existant
  prixOriginal?: number;      // nouveau
  prixFinal?: number;         // nouveau
  promotion?: PromotionLite | null; // nouveau

  description: string;
  boutique: string;
  images: { url: string; public_id: string }[];
  noteMoyenne?: number;
  noteCompte?: number;
}
