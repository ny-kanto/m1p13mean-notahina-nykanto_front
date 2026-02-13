import { Boutique } from "./boutique";

export interface Zone {
  zoneId: string;
  floor: number;
  boutiqueId: Boutique | null;
  status: 'free' | 'occupied';
}