import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {
  createSystemInfo, createSystemInfoError, createSystemInfoSuccess,
  deleteSystemInfo, deleteSystemInfoError, deleteSystemInfoSuccess,
  getSystemInfoById, getSystemInfoBySystemId, loadSystemInfos, loadSystemInfosFail, loadSystemInfosSuccess,
  replaceSystemInfoMetadata, replaceSystemInfoMetadataError, replaceSystemInfoMetadataSuccess,
  setSystemInfoById, setSystemInfoByIdError,
  setSystemInfoBySystemId, setSystemInfoBySystemIdError,
  setSystemInfoLoading, setSystemInfoError,
  upsertSystemInfo, upsertSystemInfoError, upsertSystemInfoSuccess,
  upsertSystemInfoMetadataKey, upsertSystemInfoMetadataKeyError, upsertSystemInfoMetadataKeySuccess,
  deleteDataItem,
  deleteDataItemSuccess,
  deleteDataItemFail
} from "../../actions/systemInfos/systemInfo.action";
import { SystemInfoService } from "../../../core/services/systemInfos/systemInfo.service";
import { catchError, exhaustMap, map, mergeMap, of, switchMap, withLatestFrom } from "rxjs";
import { SystemInfoUpsertEntity } from "../../../api/entities/systemInfos/systemInfoUpsert.entity";
import { selectSystemInfoState } from "../../selectors/systemInfos/systemInfo.selector";
import { AppState } from "../../app.state";
import { Store } from "@ngrx/store";

/**
 * =============================================================================
 * SystemInfoEffects
 * -----------------------------------------------------------------------------
 * Efectos NgRx para orquestar llamadas al `SystemInfoService` y despachar
 * acciones de éxito/error, además de manejar flags de UI (loading) y
 * recargas automáticas del listado tras crear.
 *
 * 🔧 Convenciones:
 * - `switchMap` para cargas simples (última gana).
 * - `mergeMap` cuando pueden coexistir múltiples requests.
 * - `exhaustMap` para evitar doble submit en upsert (ignora triggers en vuelo).
 * - Centralización de mensajes de error con `stringifyErr`.
 *
 * ⚠️ No se alteró la lógica original. Solo se agregaron comentarios.
 * =============================================================================
 */
@Injectable({ providedIn: 'root' })
export class SystemInfoEffects {
  constructor(private actions$: Actions, private svc: SystemInfoService,  private store: Store<AppState>) {}

  // -----------------------------------------------------------------------------
  // Listado paginado (opcionalmente filtrado por ambiente `env`)
  // - Si `env` viene definido → usa `getByEnvironment`.
  // - Si no, recurre a `getAll`.
  // -----------------------------------------------------------------------------
  // load$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(loadSystemInfos),
  //     switchMap(({ page, size, search, sortBy, desc }) =>
  //       this.svc.getAll({ page, size, search, sortBy, desc }).pipe(
  //         map(res => loadSystemInfosSuccess({ items: res.items, total: res.total, page: res.page, size: res.size })),
  //         catchError(err => of(loadSystemInfosFail({ error: err?.message ?? 'Error cargando SystemInfo' })))
  //       )
  //     )
  //   )
  // );

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSystemInfos),
      switchMap(({ page, size, search, sortBy, desc, env }) => {
        return (env
          ? this.svc.getByEnvironment(env, { page, size, search, sortBy, desc })
          : this.svc.getAll({ page, size, search, sortBy, desc })
        ).pipe(
          map(res => loadSystemInfosSuccess({ items: res.items, total: res.total, page: res.page, size: res.size })),
          catchError(err => of(loadSystemInfosFail({ error: err?.message ?? 'Error cargando SystemInfo' })))
        );
      })
    )
  );

  // -----------------------------------------------------------------------------
  // Detalle por ID
  // -----------------------------------------------------------------------------
  getById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getSystemInfoById),
      mergeMap(({ id }) =>
        this.svc.getById(id).pipe(
          map(info => setSystemInfoById({ info })),
          catchError(err => of(setSystemInfoByIdError({ error: err?.message ?? 'Error cargando SystemInfo' })))
        )
      )
    )
  );

  // -----------------------------------------------------------------------------
  // Detalle por FK: idSystem (proyecto)
  // -----------------------------------------------------------------------------
  getBySystemId$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getSystemInfoBySystemId),
      mergeMap(({ idSystem }) =>
        this.svc.getBySystemId(idSystem).pipe(
          map(info => setSystemInfoBySystemId({ info })),
          catchError(err => of(setSystemInfoBySystemIdError({ error: err?.message ?? 'Error cargando SystemInfo por Sistema' })))
        )
      )
    )
  );

  // -----------------------------------------------------------------------------
  // Upsert (update) con archivo opcional
  // - `exhaustMap` evita múltiples submits simultáneos.
  // - Requiere `body.id` (si falta, emite error inmediato).
  // -----------------------------------------------------------------------------
  upsert$ = createEffect(() =>
    this.actions$.pipe(
      ofType(upsertSystemInfo),
      exhaustMap(({ body, file }) => {
        const id = (body as { id?: number }).id;

        if (id == null) {
          return of(upsertSystemInfoError({ error: 'Falta id para actualizar.' }));
        }

        return this.svc.update(id, body, file ?? null).pipe(
          map(info => upsertSystemInfoSuccess({ info })),
          catchError(err => of(upsertSystemInfoError({ error: this.stringifyErr(err) })))
        );
      })
    )
  );

  // -----------------------------------------------------------------------------
  // Utilidad: Normaliza distintos formatos de error a string legible
  // -----------------------------------------------------------------------------
  private stringifyErr(e: any): string {
    return e?.error?.message ?? e?.message ?? 'Error desconocido';
  }

  // -----------------------------------------------------------------------------
  // Flags de Loading (ON)
  // Enciende loading al disparar acciones de fetch/mutación.
  // -----------------------------------------------------------------------------
  setLoadingOn$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        getSystemInfoById,
        getSystemInfoBySystemId,
        createSystemInfo,
        upsertSystemInfo,
        deleteSystemInfo,
        replaceSystemInfoMetadata,
        upsertSystemInfoMetadataKey
      ),
      map(() => setSystemInfoLoading({ loading: true }))
    )
  );

  // -----------------------------------------------------------------------------
  // Flags de Loading (OFF)
  // Apaga loading ante cualquier resultado (éxito o error) de las operaciones.
  // -----------------------------------------------------------------------------
  setLoadingOff$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        loadSystemInfosSuccess, loadSystemInfosFail,
        setSystemInfoById, setSystemInfoByIdError,
        setSystemInfoBySystemId, setSystemInfoBySystemIdError,
        createSystemInfoSuccess, createSystemInfoError,
        upsertSystemInfoSuccess, upsertSystemInfoError,
        deleteSystemInfoSuccess, deleteSystemInfoError,
        replaceSystemInfoMetadataSuccess, replaceSystemInfoMetadataError,
        upsertSystemInfoMetadataKeySuccess, upsertSystemInfoMetadataKeyError
      ),
      map(() => setSystemInfoLoading({ loading: false }))
    )
  );

  // -----------------------------------------------------------------------------
  // Apaga loading si se setea error manualmente desde UI
  // -----------------------------------------------------------------------------
  stopLoadingOnErrorSet$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setSystemInfoError),
      map(() => setSystemInfoLoading({ loading: false }))
    )
  );

  // -----------------------------------------------------------------------------
  // Eliminar DataItem asociado
  // - Éxito: emite `deleteDataItemSuccess` con ids.
  // - Error: emite `deleteDataItemFail` con string de error.
  // -----------------------------------------------------------------------------
  deleteDataItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteDataItem),
      switchMap(({ systemInfoId, itemId }) =>
        this.svc.deleteItem(systemInfoId, itemId).pipe(
          map(() => deleteDataItemSuccess({ systemInfoId, itemId })),
          catchError(err => of(deleteDataItemFail({ error: err?.error?.message ?? err?.message ?? 'No se pudo eliminar el item' })))
        )
      )
    )
  );

  // -----------------------------------------------------------------------------
  // Crear SystemInfo (con archivo opcional)
  // - Tras crear: emite `createSystemInfoSuccess` con la entidad creada.
  // -----------------------------------------------------------------------------
  create$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createSystemInfo),
      mergeMap(({ body, file }) =>
        this.svc.create(body, file ?? null).pipe( // ← pasamos file
          map(info => createSystemInfoSuccess({ info })),
          catchError(err => of(createSystemInfoError({ error: this.stringifyErr(err) })))
        )
      )
    )
  );

  // -----------------------------------------------------------------------------
  // Post-Create: recargar listado con los últimos filtros/paginación del estado
  // -----------------------------------------------------------------------------
  reloadAfterCreate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createSystemInfoSuccess),
      withLatestFrom(this.store.select(selectSystemInfoState)),
      map(([_, s]) => loadSystemInfos({
        page: s.page,
        size: s.size,
        search: s.search,
        sortBy: s.sortBy,
        desc: s.desc
      }))
    )
  );
}
