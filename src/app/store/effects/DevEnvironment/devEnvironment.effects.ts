// import { Actions, createEffect, ofType } from "@ngrx/effects";
// import { DevEnvironmentService } from "../../../core/services/devEnvironment/devEnvironment.service";
// import { loadDevEnvironments, loadDevEnvironmentsFail, loadDevEnvironmentsSuccess } from "../../actions/DevEnvironment/devEnvironment.action";
// import { catchError, map, mergeMap, of } from "rxjs";
// import { Injectable } from "@angular/core";
// @Injectable(
//   {
//     providedIn: 'root'
//   }
// )

// export class DevEnvironmentEffects {

//     constructor(private actions$: Actions, private devEnvironmentService: DevEnvironmentService) {

//     }

//     //load
//     load$ = createEffect(() =>
//         this.actions$.pipe(
//             ofType(loadDevEnvironments),
//             mergeMap(({ page, size, search, sortBy, desc }) =>
//                 this.devEnvironmentService.getAll({ page, size, search, sortBy, desc }).pipe(
//                     map(res => loadDevEnvironmentsSuccess({ items: res.items, total: res.total, page: res.page, size: res.size })),
//                     catchError(err => of(loadDevEnvironmentsFail({ error: err?.message ?? 'Error cargando roles' })))
//                 )
//             )
//         )
//     );





// }