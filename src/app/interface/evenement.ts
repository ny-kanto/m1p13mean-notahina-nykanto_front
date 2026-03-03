export interface ImageCloudinary {
  url: string;
  public_id: string;
}

export interface Evenement {
  _id: string;
  titre: string;
  description: string;

  dateDebut: string;
  dateFin: string;

  image?: ImageCloudinary | null;

  createdBy?: string;
  created_at?: string;
}
