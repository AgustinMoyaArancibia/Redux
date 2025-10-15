import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../core/services/auth/auth.service';
import {
  authClear, authHydrated, authInit,
  authLoadFromStorage, authSetFromStorage,
  authLogin, authLoginError, authLoginSuccess,
  authLogout, authLogoutError, authLogoutSuccess
} from '../../actions/auth/auth.action';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';

const SS = {
  IS_LOGGED:     'auth.isLoggedIn',
  SNAPSHOT:      'auth.snapshot' // JSON del AuthSnapshot
} as const;

@Injectable({ providedIn: 'root' })
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private auth: AuthService,
    private store: Store,
    private router: Router
  ) {}

  // INIT -> cargar desde sessionStorage y marcar hydrated
  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authInit),
      switchMap(() => {
        this.store.dispatch(authLoadFromStorage());
        return of(authHydrated());
      })
    )
  );

  // LOAD FROM STORAGE
  loadFromStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authLoadFromStorage),
      map(() => {
        let isAuthenticated = false;
        let snapshot: any = {};
        try {
          isAuthenticated = sessionStorage.getItem(SS.IS_LOGGED) === 'true';
          const raw = sessionStorage.getItem(SS.SNAPSHOT);
          snapshot = raw ? JSON.parse(raw) : {};
        } catch {}
        return authSetFromStorage({ isAuthenticated, snapshot });
      })
    )
  );

  // LOGIN
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authLogin),
      exhaustMap(({ body }) =>
        this.auth.login(body).pipe(
          map(snapshot => authLoginSuccess({ snapshot })),
          catchError(err => of(authLoginError({ error: err?.error?.message ?? 'Login error' })))
        )
      )
    )
  );

  // PERSIST on success (sessionStorage)
  persistOnSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authLoginSuccess),
        tap(({ snapshot }) => {
          try {
            sessionStorage.setItem(SS.IS_LOGGED, 'true');
            sessionStorage.setItem(SS.SNAPSHOT, JSON.stringify(snapshot));
          } catch {}
        })
      ),
    { dispatch: false }
  );

  // LOGOUT
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authLogout),
      exhaustMap(() =>
        this.auth.logout().pipe(
          map(() => authLogoutSuccess()),
          catchError(err => of(authLogoutError({ error: err?.error?.message ?? 'Logout error' })))
        )
      )
    )
  );

  // CLEAR sessionStorage after logout/clear
  clearStorageOnLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authLogoutSuccess, authClear),
        tap(() => {
          try {
            sessionStorage.removeItem(SS.IS_LOGGED);
            sessionStorage.removeItem(SS.SNAPSHOT);
          } catch {}
        })
      ),
    { dispatch: false }
  );

  redirectAfterLogout$ = createEffect(
  () =>
    this.actions$.pipe(
      ofType(authLogoutSuccess),
      tap(() => {
        // opcional: guardá la URL actual para volver luego del login
        const url = this.router.url;
        const alreadyOnLogin = url.startsWith('/login');
        const extras = alreadyOnLogin ? {} : { queryParams: { returnUrl: url } };
        this.router.navigate(['/login'], extras);
      })
    ),
  { dispatch: false }
);
}
