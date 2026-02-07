export interface Boutique {
  _id?: string;
  nom: string;
  categorie: string;
  etage: number;
  contact: {
    email: string;
    tel: string;
  };
  horaires: {
    ouverture: string;
    fermeture: string;
  };
  image?: string;
  statut: 'Ouvert' | 'Fermé';
  created_at?: Date | string;
}
