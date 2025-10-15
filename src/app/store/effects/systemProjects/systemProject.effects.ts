import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";

import { catchError, exhaustMap, map, mergeMap, of } from "rxjs";
import { SystemProjectService } from "../../../core/services/systemProject/systemProject.service";
import { getSystemProjectById, loadSystemProjects, loadSystemProjectsFail, loadSystemProjectsSuccess, loadSystemProjectsUnlinked, loadSystemProjectsUnlinkedFail, loadSystemProjectsUnlinkedSuccess, setSystemProjectById, setSystemProjectByIdError, setSystemProjectError, setSystemProjectLoading, setSystemProjects } from "../../actions/systemProjects/systemProject.action";

@Injectable({ providedIn: 'root' })
export class SystemProjectEffects {
  constructor(private actions$: Actions, private spService: SystemProjectService) {}

  // Load paginado
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSystemProjects),
      mergeMap(({ page, size, search, sortBy, desc }) =>
        this.spService.getAll({ page, size, search, sortBy, desc }).pipe(
          map(res => loadSystemProjectsSuccess({ items: res.items, total: res.total, page: res.page, size: res.size })),
          catchError(err => of(loadSystemProjectsFail({ error: err?.message ?? 'Error cargando proyectos' })))
        )
      )
    )
  );

  // GetById (mantiene última petición)
  getById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getSystemProjectById),
      mergeMap(({ id }) =>
        this.spService.getById(id).pipe(
          map(project => setSystemProjectById({ project })),
          catchError(err => of(setSystemProjectByIdError({ error: err?.message ?? 'Error cargando proyecto' })))
        )
      )
    )
  );

  

  // Loading ON al iniciar GetById
  setLoadingOn$ = createEffect(() =>
    this.actions$.pipe(ofType(getSystemProjectById), map(() => setSystemProjectLoading({ loading: true })))
  );

  // Loading OFF en éxito o error de setById
  setLoadingOffOnSetById$ = createEffect(() =>
    this.actions$.pipe(ofType(setSystemProjectById, setSystemProjectByIdError), map(() => setSystemProjectLoading({ loading: false })))
  );

loadUnlinked$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loadSystemProjectsUnlinked),
    mergeMap(() =>
      this.spService.getUnlinkedAll().pipe(
        map(items => loadSystemProjectsUnlinkedSuccess({ items })),  // items es array ✔
        catchError(err => of(loadSystemProjectsUnlinkedFail({ error: err?.message ?? 'Error cargando proyectos disponibles' })))
      )
    )
  )
);


  // Apagar loading cuando llegan resultados o error generales
  stopLoadingOnSet$ = createEffect(() =>
    this.actions$.pipe(ofType(setSystemProjects, setSystemProjectError), map(() => setSystemProjectLoading({ loading: false })))
  );
}
