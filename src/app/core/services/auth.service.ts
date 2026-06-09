import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  AuthUser,
  LoginRequest,
  LoginResponse,
  UserRole,
} from '../models/auth.model';
import { tap } from 'rxjs/operators';
import { environment } from '../../../enviroments/enviroment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly TOKEN_KEY = 'inventory_token';
  private readonly USER_KEY = 'inventory_user';

  // Signal con el usuario autenticado
  readonly currentUser = signal<AuthUser | null>(this.loadUserFromStorage());

  //Computed - true si hay sesión activa
  readonly isAuthenticated = computed(() => !!this.currentUser());

  // Computed - true si el usuario es ADMIN
  readonly isAdmin = computed(
    () => this.currentUser()?.role === UserRole.ADMIN,
  );

  login(request: LoginRequest) {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/api/auth/login`, request).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        const user: AuthUser = {
          username: response.username,
          role: response.role as UserRole
        };
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUser.set(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private loadUserFromStorage(): AuthUser | null {
    const stored = localStorage.getItem(this.USER_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  }
}
