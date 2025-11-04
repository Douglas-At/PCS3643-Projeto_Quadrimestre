import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from './core/layout/app-header.component';
import { AppFooter } from './core/layout/app-footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppHeader, AppFooter],
  template: `
    <app-header />
    <main id="conteudo" class="mx-auto max-w-6xl px-4 py-6 text-white">
      <router-outlet />
    </main>
    <app-footer />
  `
})
export class AppComponent {}
