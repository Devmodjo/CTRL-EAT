import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, User, UserRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    if (typeof window !== 'undefined' && localStorage) {
      const userStr = localStorage.getItem('ctrl_eat_user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          this.currentUserSubject.next(user);
          this.fetchMe().subscribe({ error: () => {} });
        } catch {
          this.logout();
        }
      }
    }
  }

  register(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register/`, data).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  backofficeRegister(data: { username: string; password: string; name?: string; surname?: string; phone?: string; role: 'ADMINISTRATEUR' | 'CUISINIERE' }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/backoffice-register/`, data).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  login(credentials: { username: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login/`, credentials).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  fetchMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me/`).pipe(
      tap(user => {
        if (typeof window !== 'undefined' && localStorage) {
          localStorage.setItem('ctrl_eat_user', JSON.stringify(user));
        }
        this.currentUserSubject.next(user);
      })
    );
  }

  private handleAuthSuccess(response: AuthResponse): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem('ctrl_eat_token', response.tokens.access);
      localStorage.setItem('ctrl_eat_refresh', response.tokens.refresh);
      localStorage.setItem('ctrl_eat_user', JSON.stringify(response.user));
    }
    this.currentUserSubject.next(response.user);
  }

  logout(): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem('ctrl_eat_token');
      localStorage.removeItem('ctrl_eat_refresh');
      localStorage.removeItem('ctrl_eat_user');
    }
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('ctrl_eat_token');
    }
    return null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  hasRole(roles: UserRole[]): boolean {
    const user = this.getCurrentUser();
    if (!user || !user.role) return false;
    return roles.includes(user.role);
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return !!user && (user.role === 'ADMINISTRATEUR' || !!user.is_superuser || !!user.is_staff);
  }

  isCook(): boolean {
    const user = this.getCurrentUser();
    return !!user && (user.role === 'CUISINIERE' || this.isAdmin());
  }
}
