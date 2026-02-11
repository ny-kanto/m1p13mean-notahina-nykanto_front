import { Categorie } from './categorie';
import { HoraireJour, JourSemaine } from './horaire-jour';

export interface Boutique {
  _id?: string;
  nom: string;
  categorie: string | Categorie;
  etage: number;

  contact: {
    email?: string;
    tel?: string;
  };

  horaires: Record<JourSemaine, HoraireJour>;

  ouvertMaintenant?: boolean;

  created_at?: Date | string;
  image?: {
    url: string;
    public_id: string;
  };
}
