import { createReducer, on } from "@ngrx/store";
import { InitialStateSystemInfo } from "../../states/systemInfos/systemInfo.state";
import {
  createSystemInfo,             // ⬅️ usar también la acción de inicio
  createSystemInfoError, createSystemInfoSuccess,
  deleteSystemInfo,             // ⬅️ idem
  deleteSystemInfoError, deleteSystemInfoSuccess,
  loadSystemInfos, loadSystemInfosFail, loadSystemInfosSuccess,
  resetSystemInfoState, selectSystemInfo,
  setSystemInfoById, setSystemInfoByIdError,
  setSystemInfoBySystemId, setSystemInfoBySystemIdError,
  setSystemInfoError, setSystemInfoLoading,
  upsertSystemInfo,             // ⬅️ acción de inicio de upsert
  upsertSystemInfoError, upsertSystemInfoSuccess,
  replaceSystemInfoMetadataSuccess, upsertSystemInfoMetadataKeySuccess,
  deleteDataItemFail,
  deleteDataItem,
  deleteDataItemSuccess
} from "../../actions/systemInfos/systemInfo.action";

/**
 * =============================================================================
 * Reducer: SystemInfoReducer
 * -----------------------------------------------------------------------------
 * Maneja el estado del slice "SystemInfo":
 * - Listado paginado (page/size/search/sort/desc/env) + flags `loading`.
 * - Detalle por `id` / por `idSystem` (FK) y selección (`selectedId`).
 * - Crear / Upsert / Delete con flags (`saving`, `deleting`) y actualización de `items`.
 * - Borrado de DataItem asociado a un SystemInfo (edición in-memory).
 * - Utilitarios de UI: `setSystemInfoLoading`, `setSystemInfoError`, `reset`.
 *
 * ⚠️ Nota: hay dos handlers de `loadSystemInfos` (uno “básico” y otro con `env`).
 * Se mantienen tal cual—no se cambió la lógica.
 * =============================================================================
 */

export const SystemInfoReducer = createReducer(
  InitialStateSystemInfo,

  // LISTA (paginado básico)
  on(loadSystemInfos, (state, { page, size, search = null, sortBy = null, desc = false }) => ({
    ...state, page, size, search, sortBy, desc, loading: true, error: null
  })),
  on(loadSystemInfosSuccess, (s, { items, total, page, size }) => ({
    ...s,
    loading: false,
    items: [...items],   // nueva referencia para disparar CD
    total, page, size
  })),
  on(loadSystemInfosFail, (state, { error }) => ({ ...state, loading: false, error })),

  // BY ID (mergea en items y setea seleccionado)
  on(setSystemInfoById, (state, { info }) => ({
    ...state,
    items: (state.items ?? []).map(i => i.id === info.id ? { ...i, ...info } : i),
    selectedId: info.id,
    error: null
  })),

  // Error de BY ID
  on(setSystemInfoByIdError, (state, { error }) => ({ ...state, error })),

  // BY SYSTEM ID (FK) – permite null
  on(setSystemInfoBySystemId, (state, { info }) => ({
    ...state,
    items: info
      ? (state.items ?? []).map(i => i.id === info.id ? info : i)
      : (state.items ?? []),
    selectedId: info ? info.id : null,
    error: null
  })),
  on(setSystemInfoBySystemIdError, (state, { error }) => ({ ...state, error })),

  // CREATE (flags y data)
  on(createSystemInfo, (state) => ({ ...state, saving: true, error: null })), // ⬅️ start
  on(createSystemInfoSuccess, (state, { info }) => ({
    ...state,
    items: [info, ...(state.items ?? [])],
    selectedId: info.id,
    saving: false,                       // ⬅️ end
    error: null
  })),
  on(createSystemInfoError, (state, { error }) => ({ ...state, saving: false, error })), // ⬅️ end

  // UPSERT (PUT/POST) – flags y data
  on(upsertSystemInfo, (state) => ({ ...state, saving: true, error: null })),           // ⬅️ start
  on(upsertSystemInfoSuccess, (state, { info }) => ({
    ...state,
    items: (state.items ?? []).some(i => i.id === info.id)
      ? (state.items ?? []).map(i => i.id === info.id ? info : i)
      : [info, ...(state.items ?? [])],
    selectedId: info.id,
    saving: false,                       // ⬅️ end
    error: null
  })),
  on(upsertSystemInfoError, (state, { error }) => ({ ...state, saving: false, error })), // ⬅️ end

  // DELETE (flags y data)
  on(deleteSystemInfo, (state) => ({ ...state, deleting: true, error: null })),         // ⬅️ start
  on(deleteSystemInfoSuccess, (state, { id }) => {
    const items = (state.items ?? []).filter(i => i.id !== id);
    const selectedId = state.selectedId === id ? null : state.selectedId;
    const total = Math.max(0, (state.total ?? 0) - 1);
    return { ...state, items, selectedId, total, deleting: false, error: null };        // ⬅️ end
  }),
  on(deleteSystemInfoError, (state, { error }) => ({ ...state, deleting: false, error })), // ⬅️ end

  // UI
  on(setSystemInfoLoading, (state, { loading }) => ({ ...state, loading, error: loading ? null : state.error })),
  on(selectSystemInfo, (state, { selectedId }) => ({ ...state, selectedId })),
  on(setSystemInfoError, (state, { error }) => ({ ...state, error })),

  // RESET
  on(resetSystemInfoState, () => InitialStateSystemInfo),

  // ⬇️ Flujo de borrado de DataItem (anidado dentro del SystemInfo)
  on(deleteDataItem, (state) => ({
    ...state,
    deleting: true,
    error: null
  })),

  on(deleteDataItemSuccess, (state, { systemInfoId, itemId }) => ({
    ...state,
    deleting: false,
    items: state.items.map(si =>
      si.id !== systemInfoId
        ? si
        : {
          ...si,
          dataItems: ((si as any).dataItems ?? []).filter((di: any) => di.id !== itemId)
        }
    )
  })),

  on(deleteDataItemFail, (state, { error }) => ({
    ...state,
    deleting: false,
    error
  })),

  // LISTA (paginado con `env` persistido en el estado)
  on(loadSystemInfos, (state, { page, size, search = null, sortBy = null, desc = false, env = null }) => ({
    ...state, page, size, search, sortBy, desc, env, loading: true, error: null
  })),
);
