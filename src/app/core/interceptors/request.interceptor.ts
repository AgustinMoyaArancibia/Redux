import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';

const AUTH_URLS = ['/auth/login', '/auth/refresh', '/auth/logout'];

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  const http = inject(HttpClient);
  const router = inject(Router);

  // 👉 Siempre enviar cookies (la __Host-sid viaja automáticamente)
  const withCreds = req.clone({ withCredentials: true });

  return next(withCreds).pipe(
    catchError((err: HttpErrorResponse) => {
      // Si la request dio 401 y no era una de auth
      if (err.status === 401 && !AUTH_URLS.some(u => req.url.includes(u))) {
        console.warn('[Auth] Sesión expirada o sin cookie, intentando refresh...');

        // Intentar refresh silencioso
        return http.post('/api/auth/refresh', {}, { withCredentials: true }).pipe(
          // Si el refresh funciona, reintenta la request original
          switchMap(() => next(withCreds)),

          // Si el refresh también falla => redirige al login
          catchError(refreshErr => {
            console.error('[Auth] Refresh falló, redirigiendo al login');
            router.navigate(['/login']);
            return throwError(() => refreshErr);
          })
        );
      }

      // Si el error no es 401 o ya es de auth, no tocamos nada
      return throwError(() => err);
    })
  );
};
