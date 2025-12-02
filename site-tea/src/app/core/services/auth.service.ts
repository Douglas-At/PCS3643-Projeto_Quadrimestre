import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API_URL = 'http://localhost:5000/api/usuarios';

  private _token = signal<string | null>(localStorage.getItem('token'));
  private _user = signal<any | null>(this.loadUserFromStorage());

  readonly isAuthenticated = computed(() => !!this._token());
  readonly user = computed(() => this._user());

  constructor(private http: HttpClient) {}

  private loadUserFromStorage() {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  }

  login(email: string, senha: string) {
    return this.http.post<{ token: string; usuario: any }>(
      `${this.API_URL}/login`,
      { email, senha }
    ).pipe(
      tap(res => {
        // salva token
        localStorage.setItem('token', res.token);
        this._token.set(res.token);

        // salva usuário
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        this._user.set(res.usuario);
      }),
      map(res => res.usuario) // devolve apenas o usuario para o login.page.ts
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this._token.set(null);
    this._user.set(null);
  }

  getUsuario() {
    return this._user();
  }
}
