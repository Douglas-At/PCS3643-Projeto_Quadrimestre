import { inject } from '@angular/core';
import { CanMatchFn, Route, UrlSegment, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanMatchFn = (_route: Route, segments: UrlSegment[]) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) return true;

  const attempted = '/' + segments.map(s => s.path).join('/');
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: attempted || '/' },
  });
};
