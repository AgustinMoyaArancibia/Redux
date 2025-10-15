import { createReducer, on } from '@ngrx/store';
import { InitialAuthState, AuthState } from '../../../api/entities/auth/authState.entity'; // actualizá la ruta si cambió
import {
  authSetLoading, authSetError, authLogin, authLoginSuccess, authLoginError,
  authLogout, authLogoutSuccess, authLogoutError, authHydrated, authClear, authSetFromStorage
} from '../../actions/auth/auth.action';

export const AuthReducer = createReducer(
  InitialAuthState,

  on(authHydrated, (s) => ({ ...s, hydrated: true })),
  on(authClear, () => ({ ...InitialAuthState })),

  on(authSetLoading, (s, { loading }) => ({ ...s, loading })),
  on(authSetError,   (s, { error })   => ({ ...s, error })),

  on(authSetFromStorage, (s, { isAuthenticated, snapshot }) => ({
    ...s,
    isAuthenticated,
    userName: snapshot.userName ?? null,
    nombreCompleto: snapshot.nombreCompleto ?? null,
    grupos: snapshot.grupos ?? [],
    mail: snapshot.mail ?? null,
    idEmpleado: snapshot.idEmpleado ?? null,
    sectorId: snapshot.sectorId ?? null,
    sector: snapshot.sector ?? null,
    gerenciaId: snapshot.gerenciaId ?? null,
    gerencia: snapshot.gerencia ?? null,
  })),

  on(authLogin, (s) => ({ ...s, loading: true, error: null })),
  on(authLoginSuccess, (s, { snapshot }) => ({
    ...s,
    loading: false,
    error: null,
    isAuthenticated: true,
    userName: snapshot.userName,
    nombreCompleto: snapshot.nombreCompleto,
    grupos: snapshot.grupos,
    mail: snapshot.mail,
    idEmpleado: snapshot.idEmpleado,
    sectorId: snapshot.sectorId,
    sector: snapshot.sector,
    gerenciaId: snapshot.gerenciaId,
    gerencia: snapshot.gerencia
  })),
  on(authLoginError, (s, { error }) => ({ ...s, loading: false, error })),

  on(authLogout, (s) => ({ ...s, loading: true })),
  on(authLogoutSuccess, () => ({ ...InitialAuthState })),
  on(authLogoutError, (s, { error }) => ({ ...s, loading: false, error }))
);
