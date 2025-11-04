
import { Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: 'login.page.html'
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  showPwd = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);
  submitted = signal(false); // ✅ substitui o this.form.submitted

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  invalid(field: 'email' | 'password') {
    const c = this.form.get(field);
    return !!(c?.invalid && (c?.touched || this.submitted()));
  }

  async onSubmit() {
    this.submitted.set(true); // ✅ define que o form foi submetido
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    try {
      const { email, password } = this.form.value;
      const token = await this.auth.login(email!, password!).toPromise();

      if (token) {
        localStorage.setItem('token', token);
        this.router.navigateByUrl('/');
      } else {
        this.error.set('E-mail ou senha incorretos.');
      }
    } catch (e: any) {
      this.error.set(e?.message ?? 'Erro ao entrar. Tente novamente.');
    } finally {
      this.loading.set(false);
    }
  }
}
