import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";

import { catchError, exhaustMap, map, mergeMap, of } from "rxjs";
import { SystemProjectService } from "../../../core/services/systemProject/systemProject.service";
import { getSystemProjectById, loadSystemProjects, loadSystemProjectsFail, loadSystemProjectsSuccess, setSystemProjectById, setSystemProjectByIdError, setSystemProjectError, setSystemProjectLoading, setSystemProjects } from "../../actions/systemProjects/systemProject.action";
import { DataItemService } from "../../../core/services/dataItem/dataItem.service";
import { getDataItemById, loadDataItem, loadDataItemFail, loadDataItemSuccess, setDataItem, setDataItemById, setDataItemByIdError, setDataItemError, setDataItemLoading } from "../../actions/dataItem/dataItem.action";

@Injectable({ providedIn: 'root' })
export class DataItemEffects {
  constructor(private actions$: Actions, private spService: DataItemService) { }

  // Load paginado
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDataItem),
      mergeMap(({ page, size, search, sortBy, desc }) =>
        this.spService.getAll({ page, size, search, sortBy, desc }).pipe(
          map(d => loadDataItemSuccess({
            items: d.items,
            total: d.total,
            page: d.page,
            size: d.size
          })),
          catchError(err => of(loadDataItemFail({ error: err?.message ?? 'Error cargando items' })))
        )
      )
    )
  );
  // GetById (mantiene última petición)
  getById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getDataItemById),
      mergeMap(({ id }) =>
        this.spService.getById(id).pipe(
          map(project => setDataItemById({ project })),
          catchError(err => of(setDataItemByIdError({ error: err?.message ?? 'Error cargando item' })))
        )
      )
    )
  );



  // Loading ON al iniciar GetById
  setLoadingOn$ = createEffect(() =>
    this.actions$.pipe(ofType(getDataItemById), map(() => setDataItemLoading({ loading: true })))
  );

  // Loading OFF en éxito o error de setById
  setLoadingOffOnSetById$ = createEffect(() =>
    this.actions$.pipe(ofType(setDataItemById, setDataItemByIdError), map(() => setDataItemLoading({ loading: false })))
  );



  // Apagar loading cuando llegan resultados o error generales
  stopLoadingOnSet$ = createEffect(() =>
    this.actions$.pipe(ofType(setDataItem, setDataItemError), map(() => setDataItemLoading({ loading: false })))
  );
}
