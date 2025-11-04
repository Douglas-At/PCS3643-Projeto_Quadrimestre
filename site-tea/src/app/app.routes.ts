import { Routes } from '@angular/router';
import { authGuard } from './core/services/auth.guard';

export const routes: Routes = [
  // 🔓 Páginas públicas
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.page').then((m) => m.HomePage),
    title: 'Início',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.page').then((m) => m.LoginPage),
    title: 'Entrar',
  },
  {
    path: 'm-chat',
    loadComponent: () =>
      import('./features/m-chat/m-chat.page').then((m) => m.MChatPage),
    title: 'M-Chat',
  },

  // 🔐 Áreas restritas
  {
    path: 'paineis',
    canMatch: [authGuard],
    loadComponent: () =>
      import('./features/paineis/paineis.page').then((m) => m.PaineisPage),
    title: 'Painéis',
  },
  {
    path: 'rastreamento',
    canMatch: [authGuard],
    loadComponent: () =>
      import('./features/rastreamento/rastreamento.page').then(
        (m) => m.RastreamentoPage
      ),
    title: 'Rastreamento',
  },
  {
    path: 'recursos',
    canMatch: [authGuard],
    loadComponent: () =>
      import('./features/recursos/recursos.page').then(
        (m) => m.RecursosPage
      ),
    title: 'Recursos',
  },

  // 🌐 Qualquer rota inválida → volta pra Home
  { path: '**', redirectTo: '' },
];
