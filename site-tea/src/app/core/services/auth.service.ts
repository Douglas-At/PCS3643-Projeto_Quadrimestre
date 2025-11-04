// src/app/core/services/auth.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { of, delay, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _token = signal<string | null>(localStorage.getItem('token'));
  readonly isAuthenticated = computed(() => !!this._token());

  login(email: string, password: string) {
    if (email === 'professor@escola.com' && password === '123456') {
      return of('mock-jwt-token').pipe(
        delay(600),
        map(token => {
          localStorage.setItem('token', token);
          this._token.set(token);
          return token;
        })
      );
    }
    return of(null).pipe(delay(600), map(() => { throw new Error('Credenciais inválidas'); }));
  }

  logout() {
    localStorage.removeItem('token');
    this._token.set(null);
  }
}
 