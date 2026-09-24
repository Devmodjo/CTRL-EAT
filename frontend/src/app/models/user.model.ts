export type UserRole = 'ETUDIANT' | 'CUISINIERE' | 'ADMINISTRATEUR';

export interface User {
  id: number;
  username: string;
  email: string;
  client_id?: string;
  name?: string;
  surname?: string;
  classe?: string;
  phone?: string;
  role?: UserRole;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  tokens: AuthTokens;
}

export interface ClientProfile {
  id: string;
  username: string;
  email: string;
  name: string;
  surname: string;
  classe: string;
  phone: string;
  role: UserRole;
  role_display: string;
  date_creation: string;
}
