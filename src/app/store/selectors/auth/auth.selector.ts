import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../../../api/entities/auth/authState.entity';

export const selectAuthState = createFeatureSelector<AuthState>('AuthState');

export const selectAuthLoading     = createSelector(selectAuthState, s => s.loading);
export const selectAuthError       = createSelector(selectAuthState, s => s.error);
export const selectIsAuthenticated = createSelector(selectAuthState, s => s.isAuthenticated);
export const selectHydrated        = createSelector(selectAuthState, s => s.hydrated);

// datos
export const selectAuthUserName      = createSelector(selectAuthState, s => s.userName);
export const selectAuthNombreCompleto= createSelector(selectAuthState, s => s.nombreCompleto);
export const selectAuthGrupos        = createSelector(selectAuthState, s => s.grupos);
export const selectAuthMail          = createSelector(selectAuthState, s => s.mail);

export const selectAuthIdEmpleado    = createSelector(selectAuthState, s => s.idEmpleado);
export const selectAuthSectorId      = createSelector(selectAuthState, s => s.sectorId);
export const selectAuthSector        = createSelector(selectAuthState, s => s.sector);
export const selectAuthGerenciaId    = createSelector(selectAuthState, s => s.gerenciaId);
export const selectAuthGerencia      = createSelector(selectAuthState, s => s.gerencia);
