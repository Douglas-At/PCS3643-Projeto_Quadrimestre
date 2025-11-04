import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API_URL = 'http://localhost:5000/api/usuarios';
  private _token = signal<string | null>(localStorage.getItem('token'));
  readonly isAuthenticated = computed(() => !!this._token());

  constructor(private http: HttpClient) {}

  login(email: string, senha: string) {
    return this.http.post<{ token: string; usuario: any }>(
      `${this.API_URL}/login`,
      { email, senha }
    ).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario', JSON.stringify(res.usuario));
        this._token.set(res.token);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this._token.set(null);
  }

  getUsuario() {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  }
}
