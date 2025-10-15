import { createAction, props } from "@ngrx/store";
import { SystemInfoEntity } from "../../../api/entities/systemInfos/systemInfo.entity";
import { SystemInfoUpsertEntity } from "../../../api/entities/systemInfos/systemInfoUpsert.entity";

/**
 * =============================================================================
 *  SystemInfo – Acciones NgRx
 * =============================================================================
 * Este archivo define todas las acciones relacionadas con:
 * - Listado paginado (con búsqueda/orden y filtro por ambiente `env`)
 * - Obtención por ID o por `idSystem` (FK)
 * - Creación / Upsert (con soporte de archivo)
 * - Eliminación de SystemInfo y de DataItems asociados
 * - Metadatos (replace/upsert de claves sueltas)
 * - Flags de UI (loading/error) y selección/reset del estado
 *
 * Notas:
 * - `SystemInfoEntity`: shape leído desde la API (read DTO).
 * - `SystemInfoUpsertEntity`: shape enviado al crear/actualizar (write DTO).
 * - Las acciones `...Success`/`...Error`/`...Fail` permiten a efectos/reducers
 *   conocer el resultado del llamado asíncrono.
 */

/* ============================================================================
   LIST (PAGED)
   ========================================================================== */
// list (paged)
// export const loadSystemInfos = createAction(
//   '[SystemInfo] Load',
//   props<{ page: number; size: number; search?: string | null; sortBy?: string | null; desc?: boolean }>()
// );

/**
 * Solicita un listado paginado de SystemInfos, con soporte de:
 * - `page`, `size`: paginación (1-based en la UI, ajustar en el effect si hace falta)
 * - `search`: filtro de texto libre (opcional)
 * - `sortBy` + `desc`: ordenamiento (opcional)
 * - `env`: filtro por ambiente (DEV/TST/PRD) (opcional)
 */
export const loadSystemInfos = createAction(
  '[SystemInfo] Load',
  props<{ page: number; size: number; search?: string | null; sortBy?: string | null; desc?: boolean; env?: string | null }>()
);

/** Respuesta exitosa del listado paginado. */
export const loadSystemInfosSuccess = createAction(
  '[SystemInfo API] Load Success',
  props<{ items: SystemInfoEntity[]; total: number; page: number; size: number }>()
);

/** Error en la solicitud de listado. */
export const loadSystemInfosFail = createAction(
  '[SystemInfo API] Load Fail',
  props<{ error: string }>()
);

/* ============================================================================
   GET BY ID
   ========================================================================== */
/** Solicita el detalle de un SystemInfo por su `id`. */
export const getSystemInfoById = createAction(
  '[SystemInfo] Get By Id',
  props<{ id: number }>()
);

/** Setea en el store el detalle recibido. */
export const setSystemInfoById = createAction(
  '[SystemInfo] Set By Id',
  props<{ info: SystemInfoEntity }>()
);

/** Setea error asociado a la carga por `id`. */
export const setSystemInfoByIdError = createAction(
  '[SystemInfo] Set By Id Error',
  props<{ error: string }>()
);

/* ============================================================================
   GET BY SYSTEM (FK: idSystem)
   ========================================================================== */
/** Solicita el detalle de un SystemInfo por `idSystem` (FK a proyecto). */
export const getSystemInfoBySystemId = createAction(
  '[SystemInfo] Get By SystemId',
  props<{ idSystem: number }>()
);

/** Setea en el store el detalle recibido (o `null` si no existe). */
export const setSystemInfoBySystemId = createAction(
  '[SystemInfo] Set By SystemId',
  props<{ info: SystemInfoEntity | null }>()
);

/** Setea error para la carga por `idSystem`. */
export const setSystemInfoBySystemIdError = createAction(
  '[SystemInfo] Set By SystemId Error',
  props<{ error: string }>()
);

/* ============================================================================
   CREATE / UPSERT / DELETE
   ========================================================================== */
/**
 * Crea un SystemInfo.
 * - `body`: payload de creación (Upsert DTO).
 * - `file`: archivo opcional (ej. imagen) que viaja como `multipart/form-data`.
 */
export const createSystemInfo = createAction(
  '[SystemInfo] Create',
  props<{ body: SystemInfoUpsertEntity; file?: File | null }>() // ← agregado file
);

/** Creación exitosa: retorna la entidad creada. */
export const createSystemInfoSuccess = createAction(
  '[SystemInfo] Create Success',
  props<{ info: SystemInfoEntity }>()
);

/** Error en creación. */
export const createSystemInfoError = createAction(
  '[SystemInfo] Create Error',
  props<{ error: string }>()
);

/**
 * Upsert (crear o actualizar si existe).
 * - `body`: payload de upsert (Upsert DTO).
 * - `file`: archivo opcional (imagen).
 */
export const upsertSystemInfo = createAction(
  '[SystemInfo] Upsert',
  props<{ body: SystemInfoUpsertEntity; file?: File | null }>()
);

/** Upsert exitoso. */
export const upsertSystemInfoSuccess = createAction(
  '[SystemInfo] Upsert Success',
  props<{ info: SystemInfoEntity }>()
);

/** Error controlado en upsert (string). */
export const upsertSystemInfoError = createAction(
  '[SystemInfo] Upsert Error',
  props<{ error: string }>()
);

/** Error genérico en upsert (tipado `any` para capturar fallos variados). */
export const upsertSystemInfoFailure = createAction('[SystemInfo] Upsert Failure', props<{ error: any }>());

/** Solicita eliminación de un SystemInfo por `id`. */
export const deleteSystemInfo = createAction(
  '[SystemInfo] Delete',
  props<{ id: number }>()
);

/** Eliminación exitosa (eco del `id` borrado). */
export const deleteSystemInfoSuccess = createAction(
  '[SystemInfo] Delete Success',
  props<{ id: number }>()
);

/** Error al eliminar. */
export const deleteSystemInfoError = createAction(
  '[SystemInfo] Delete Error',
  props<{ error: string }>()
);

/* ============================================================================
   METADATA (clave/valor)
   ========================================================================== */
/**
 * Reemplaza completamente el objeto de metadatos de un SystemInfo.
 * - `meta`: objeto arbitrario (se recomienda validarlo en backend).
 */
export const replaceSystemInfoMetadata = createAction(
  '[SystemInfo] Replace Metadata',
  props<{ id: number; meta: Record<string, unknown | null> }>()
);

/** Confirmación de replace de metadatos. */
export const replaceSystemInfoMetadataSuccess = createAction(
  '[SystemInfo] Replace Metadata Success',
  props<{ id: number }>()
);

/** Error en replace de metadatos. */
export const replaceSystemInfoMetadataError = createAction(
  '[SystemInfo] Replace Metadata Error',
  props<{ error: string }>()
);

/**
 * Upsert de una clave específica de metadatos.
 * - `key`: nombre de la clave.
 * - `value`: valor (puede ser `null` para limpiar).
 */
export const upsertSystemInfoMetadataKey = createAction(
  '[SystemInfo] Upsert Metadata Key',
  props<{ id: number; key: string; value: unknown | null }>()
);

/** Confirmación de upsert de clave de metadatos. */
export const upsertSystemInfoMetadataKeySuccess = createAction(
  '[SystemInfo] Upsert Metadata Key Success',
  props<{ id: number; key: string; value: unknown | null }>()
);

/** Error en upsert de clave de metadatos. */
export const upsertSystemInfoMetadataKeyError = createAction(
  '[SystemInfo] Upsert Metadata Key Error',
  props<{ error: string }>()
);

/* ============================================================================
   UI FLAGS / SELECCIÓN / RESET
   ========================================================================== */
/** Setea flag de carga en el slice de SystemInfo. */
export const setSystemInfoLoading = createAction(
  '[SystemInfo] Set Loading',
  props<{ loading: boolean }>()
);

/** Setea mensaje de error (o limpia con `null`). */
export const setSystemInfoError = createAction(
  '[SystemInfo] Set Error',
  props<{ error: string | null }>()
);

/** Marca un `selectedId` en el estado (o `null` para deseleccionar). */
export const selectSystemInfo = createAction(
  '[SystemInfo] Select',
  props<{ selectedId: number | null }>()
);

/** Restablece el estado del slice a su valor inicial. */
export const resetSystemInfoState = createAction('[SystemInfo] Reset State');

/* ============================================================================
   DATAITEMS ASOCIADOS (acciones puntuales)
   ========================================================================== */
/**
 * Elimina un DataItem asociado a un SystemInfo.
 * - `systemInfoId`: ID del SystemInfo (padre)
 * - `itemId`: ID del DataItem a quitar
 */
export const deleteDataItem = createAction(
  '[SystemInfo] Delete DataItem',
  props<{ systemInfoId: number; itemId: number }>()
);

/** Confirmación de borrado del DataItem. */
export const deleteDataItemSuccess = createAction(
  '[SystemInfo API] Delete DataItem Success',
  props<{ systemInfoId: number; itemId: number }>()
);

/** Error al borrar un DataItem asociado. */
export const deleteDataItemFail = createAction(
  '[SystemInfo API] Delete DataItem Fail',
  props<{ error: string }>()
);
