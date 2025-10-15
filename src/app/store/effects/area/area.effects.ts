import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AreaService} from "../../../core/services/area/area.service";
import { loadAreas, loadAreasFail, loadAreasSuccess } from "../../actions/areas/area.action";
import { catchError, map, mergeMap, of } from "rxjs";
import { Injectable } from "@angular/core";
@Injectable(
  {
    providedIn: 'root'
  }
)

export class AreaEffects {

  constructor(private actions$: Actions, private areaService: AreaService) {

  }


// area.effects.ts
// area.effects.ts
load$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loadAreas),
    mergeMap(({ page, size, search, sortBy, desc }) =>
      this.areaService.getAll({ page, size, search, sortBy, desc }).pipe(
        map((res: any) => {
          // Soporta res.data.{items,...} y también res.{items,...}
          const d = (res?.data && (Array.isArray(res.data.items) || 'total' in res.data))
            ? res.data
            : res;

          return loadAreasSuccess({
            items: d.items ?? [],
            total: d.total ?? 0,
            page : d.page  ?? page,
            size : d.size  ?? size
          });
        }),
        catchError(err => of(loadAreasFail({ error: err?.message ?? 'Error cargando áreas' })))
      )
    )
  )
);




}