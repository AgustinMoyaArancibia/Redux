// sector.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SectorState } from '../../../api/entities/sachSectors/sectorState';


// OJO: esta key **debe** coincidir con la usada al registrar el reducer
export const selectManagmentState = createFeatureSelector<SectorState>('managment');

export const selectManagments = createSelector(
  selectManagmentState,
  (s) => s?.items ?? []          // <-- null-safe
);

export const selectManagmentsLoading = createSelector(
  selectManagmentState,
  (s) => s?.loading ?? false     // <-- null-safe
);

export const selectManagmentsError = createSelector(
  selectManagmentState,
  (s) => s?.error ?? null        // <-- null-safe
);

export const selectManagmentsIdGerencia = createSelector(
  selectManagmentState,
  (s) => s?.idGerencia ?? null   // <-- null-safe
);
