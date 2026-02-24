// interface/avis.ts
export type EntityType = 'boutique' | 'produit';

export interface UserMini {
  _id: string;
  nom: string;
  email: string;
}

export interface AvisApi {
  _id: string;
  user: UserMini | string;
  entityType: EntityType;
  entityId: string;
  note: number;
  commentaire: string;
  created_at: string;
}
