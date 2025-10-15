// src/app/store/effects/sectors/sector.effects.ts
import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";

import { catchError, map, of, switchMap } from "rxjs";
import { SectorService } from "../../../core/services/sachSector/sector.service";
import { loadSectors, loadSectorsSuccess, loadSectorsFailure } from "../../actions/sachSectors/sector.actions";

@Injectable()
export class SectorEffects {
  private actions$ = inject(Actions);
  private service = inject(SectorService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSectors),
      switchMap(({ idGerencia }) =>
        this.service.getAll(idGerencia).pipe(
          map(items => loadSectorsSuccess({ items })),
          catchError(err => of(loadSectorsFailure({ error: err?.message ?? "Error al cargar sectores" })))
        )
      )
    )
  );
}
