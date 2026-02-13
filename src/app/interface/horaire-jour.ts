export interface HoraireJour {
  ouverture?: string;
  fermeture?: string;
  ferme: boolean;
}

export type JourSemaine =
  | 'lundi'
  | 'mardi'
  | 'mercredi'
  | 'jeudi'
  | 'vendredi'
  | 'samedi'
  | 'dimanche';
