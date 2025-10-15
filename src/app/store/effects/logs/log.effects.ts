import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { LogService } from "../../../core/services/log/log.service";
import { loadLogs, loadLogsFail, loadLogsSuccess } from "../../actions/logs/log.action";
import { Injectable } from "@angular/core";
@Injectable()
export class LogEffects {

  constructor(private actions$: Actions, private logsService: LogService) {

  }
    
load$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loadLogs),
    mergeMap(({ page, size, search, sortBy, desc }) =>
      this.logsService.getAll({ page, size, search, sortBy, desc }).pipe(
        map((res: any) => {
          
          const d = (res?.data && (Array.isArray(res.data.items) || 'total' in res.data))
            ? res.data
            : res;

          return loadLogsSuccess({
            items: d.items ?? [],
            total: d.total ?? 0,
            page : d.page  ?? page,
            size : d.size  ?? size
          });
        }),
        catchError(err => of(loadLogsFail({ error: err?.message ?? 'Error cargando áreas' })))
      )
    )
  )
);


}


