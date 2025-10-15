import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';

import { map, take } from 'rxjs/operators';
import { selectUserRole } from '../../store/selectors/auth/auth.selector';

/** Lee roles permitidos desde route.data.roles = ['Admin', 'Manager'] */
export const roleCanMatch: CanMatchFn = (route, segments) => {
  const store  = inject<Store<AppState>>(Store);
  const router = inject(Router);
  const allowed = (route.data?.['roles'] as string[] | undefined) ?? [];

  // si la ruta no define roles, pasa
  if (!allowed.length) return true;

  const url = '/' + segments.map(s => s.path).join('/');

  return store.select(selectUserRole).pipe( // o selectUserRole si es string
    take(1),
    map(userRoles => {
      const has = Array.isArray(userRoles)
        ? userRoles.some(r => allowed.includes(r))
        : allowed.includes(userRoles as any);
      return has ? true : router.createUrlTree(['/forbidden'], { queryParams: { returnUrl: url } });
    })
  );
};
