// sector.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SectorState } from '../../../api/entities/sachSectors/sectorState';


// OJO: esta key **debe** coincidir con la usada al registrar el reducer
export const selectSectorState = createFeatureSelector<SectorState>('sectors');

export const selectSectors = createSelector(
  selectSectorState,
  (s) => s?.items ?? []          // <-- null-safe
);

export const selectSectorsLoading = createSelector(
  selectSectorState,
  (s) => s?.loading ?? false     // <-- null-safe
);

export const selectSectorsError = createSelector(
  selectSectorState,
  (s) => s?.error ?? null        // <-- null-safe
);

export const selectSectorsIdGerencia = createSelector(
  selectSectorState,
  (s) => s?.idGerencia ?? null   // <-- null-safe
);
