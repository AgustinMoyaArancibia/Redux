import { createAction, props } from '@ngrx/store';
import { AuthSnapshot } from '../../../api/entities/auth/AuthSnapshotEntity ';
import { LoginDominioRequest } from '../../../api/entities/auth/LoginDominioRequest ';


export const authLogin  = createAction('[Auth] Login',  props<{ body: LoginDominioRequest }>());
export const authLogout = createAction('[Auth] Logout');

export const authLoginSuccess = createAction('[Auth API] Login Success', props<{ snapshot: AuthSnapshot }>());
export const authLoginError   = createAction('[Auth API] Login Error',   props<{ error: string }>());

export const authLogoutSuccess = createAction('[Auth API] Logout Success');
export const authLogoutError   = createAction('[Auth API] Logout Error', props<{ error: string }>());

export const authInit      = createAction('[Auth] Init');
export const authHydrated  = createAction('[Auth] Hydrated');
export const authLoadFromStorage = createAction('[Auth] Load From Storage');

export const authSetFromStorage = createAction(
  '[Auth] Set From Storage',
  props<{ isAuthenticated: boolean; snapshot: Partial<AuthSnapshot> }>()
);

export const authSetLoading = createAction('[Auth] Set Loading', props<{ loading: boolean }>());
export const authSetError   = createAction('[Auth] Set Error',   props<{ error: string | null }>());
export const authClear      = createAction('[Auth] Clear');
