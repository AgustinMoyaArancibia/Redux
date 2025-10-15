import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // aseguramos que existe window
  const isBrowser = typeof window !== 'undefined' && !!window.sessionStorage;

  // usamos sessionStorage en lugar de localStorage
  const isLoggedIn =
    isBrowser && sessionStorage.getItem('auth.isLoggedIn') === 'true';

  if (isLoggedIn) {
    return true;
  }

  // si no está logueado, lo mandamos al login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
