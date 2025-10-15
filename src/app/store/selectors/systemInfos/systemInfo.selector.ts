import { createSelector } from "@ngrx/store";
import { AppState } from "../../app.state";

/**
 * Raíz del slice `SystemInfoState` dentro del `AppState`.
 * Se usa como base para componer el resto de selectores.
 */
export const selectSystemInfoState = (state: AppState) => state.SystemInfoState;

/** Lista en memoria de SystemInfos (último fetch o actualizaciones locales). */
export const selectSystemInfos        = createSelector(selectSystemInfoState, s => s.items);
/** Flag de carga general del slice (`true` durante fetch/mutaciones). */
export const selectSystemInfoLoading  = createSelector(selectSystemInfoState, s => s.loading);
/** Último error registrado (o `null` si no hay). */
export const selectSystemInfoError    = createSelector(selectSystemInfoState, s => s.error);

/** Número de página vigente según el último `loadSystemInfos` (o similar). */
export const selectSystemInfoPage     = createSelector(selectSystemInfoState, s => s.page);
/** Tamaño de página vigente. */
export const selectSystemInfoSize     = createSelector(selectSystemInfoState, s => s.size);
/** Total de registros informado por el backend. */
export const selectSystemInfoTotal    = createSelector(selectSystemInfoState, s => s.total);
/**
 * Total de páginas calculado con `total / size`.
 * Usa `Math.max(1, ...)` para evitar 0 páginas cuando aún no hay datos.
 */
export const selectSystemInfoTotalPages = createSelector(
  selectSystemInfoTotal, selectSystemInfoSize, (t, s) => Math.max(1, Math.ceil(t / s))
);

/** ID actualmente seleccionado en la UI (o `null`). */
export const selectSelectedSystemInfoId = createSelector(selectSystemInfoState, s => s.selectedId);
/**
 * Entidad seleccionada, buscando en `items` por `selectedId`.
 * Si no hay match, retorna `null`.
 */
export const selectSelectedSystemInfo = createSelector(
  selectSystemInfos, selectSelectedSystemInfoId,
  (items, id) => items.find(i => i.id === id) ?? null
);

// por SystemId (útil en forms por FK)
/**
 * Factory de selector por `idSystem` (FK al proyecto).
 * Uso: `const sel = makeSelectSystemInfoBySystemId(123); this.store.select(sel)`
 */
export const makeSelectSystemInfoBySystemId = (idSystem: number) => createSelector(
  selectSystemInfos, (items) => items.find(i => i.idSystem === idSystem) ?? null
);

/** Flag de guardado en curso (create/upsert). */
export const selectSystemInfoSaving   = createSelector(selectSystemInfoState, s => s.saving);
/** Flag de borrado en curso (delete o deleteDataItem). */
export const selectSystemInfoDeleting = createSelector(selectSystemInfoState, s => s.deleting);
/**
 * Factory de selector por `id` concreto. Útil cuando no dependés del `selectedId`
 * y querés una entidad puntual de la lista en memoria.
 */
export const selectSystemInfoById = (id: number) =>
  createSelector(selectSystemInfos, list => list.find(x => x.id === id) ?? null);
