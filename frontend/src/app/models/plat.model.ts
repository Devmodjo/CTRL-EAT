export interface Plat {
  id: string;
  name: string;
  details?: string;
  image?: string;
  image_url?: string;
  price: number;
  disponibility: boolean;
  commandes_demain?: number;
  createdAt?: string;
}

export interface PlatCompteur {
  id: string;
  name: string;
  price: number;
  image?: string;
  disponibility: boolean;
  commandes_demain_count: number;
  date_livraison_cible: string;
}
