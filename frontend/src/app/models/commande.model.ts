import { Plat } from './plat.model';
import { ClientProfile } from './user.model';

export type CommandeStatus = 
  | 'EN_ATTENTE' 
  | 'CONFIRMER' 
  | 'EN_PREPARATION' 
  | 'PRETE' 
  | 'LIVREE' 
  | 'ANNULEE';

export interface CommandeItem {
  id?: number;
  plat: string;
  plat_detail?: Plat;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface CommandeItemInput {
  plat_id: string;
  quantity: number;
}

export interface Commande {
  id: string;
  client: string;
  client_detail?: ClientProfile;
  quantity: number;
  total_price: number;
  date_creation: string;
  date_livraison: string;
  status: CommandeStatus;
  status_display: string;
  payment_proof?: string;
  payment_proof_url?: string;
  payment_verified: boolean;
  notes?: string;
  items: CommandeItem[];
  message_livraison?: string;
  note_limite_heure?: string;
}

export interface CuisinierePlatRecap {
  plat_id: string;
  plat_nom: string;
  plat_prix: number;
  plat_image?: string;
  quantite_totale_a_preparer: number;
}

export interface CuisiniereRecapResponse {
  date_livraison: string;
  date_livraison_formatee: string;
  total_commandes: number;
  total_portion_repas: number;
  plats_a_preparer: CuisinierePlatRecap[];
}
