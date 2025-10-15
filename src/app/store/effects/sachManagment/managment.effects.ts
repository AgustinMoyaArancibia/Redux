// src/app/store/effects/sectors/sector.effects.ts
import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";

import { catchError, map, of, switchMap } from "rxjs";
import { SectorService } from "../../../core/services/sachSector/sector.service";
import { loadSectors, loadSectorsSuccess, loadSectorsFailure } from "../../actions/sachSectors/sector.actions";
import { ManagmentService } from "../../../core/services/sachManagment/managment.service";
import { loadManagment, loadManagmentFailure, loadManagmentSuccess } from "../../actions/sachManagment/managment.action";

@Injectable()
export class ManagmentEffects {
  private actions$ = inject(Actions);
  private service = inject(ManagmentService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadManagment),
      switchMap(({  }) =>
        this.service.getAll().pipe(
          map(items => loadManagmentSuccess({ items })),
          catchError(err => of(loadManagmentFailure({ error: err?.message ?? "Error al cargar gerencias" })))
        )
      )
    )
  );
}
