// import { Injectable } from "@angular/core";

// import { RoleService } from "../../../core/services/role/role.service";

// import { catchError, exhaustMap, map, mergeMap, of, switchMap } from "rxjs";
// import { createRole, createRoleError, createRoleSuccess, deleteRole, deleteRoleError, deleteRoleSuccess, getRoleById, loadRoles, loadRolesFail, loadRolesSuccess, selectRole, setRoleById, setRoleByIdError, setRoleError, setRoleLoading, setRoles, updateRole, updateRoleError, updateRoleSuccess } from "../../actions/roles/role.action";
// import { Actions, createEffect, ofType } from '@ngrx/effects';
// @Injectable(
//   {
//     providedIn: 'root'
//   }
// )

// export class RoleEffects {

//   constructor(private actions$: Actions, private roleService: RoleService) {

//   }

//   //load
//   load$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(loadRoles),
//       mergeMap(({ page, size, search, sortBy, desc }) =>
//         this.roleService.getAll({ page, size, search, sortBy, desc }).pipe(
//           map(res => loadRolesSuccess({ items: res.items, total: res.total, page: res.page, size: res.size })),
//           catchError(err => of(loadRolesFail({ error: err?.message ?? 'Error cargando roles' })))
//         )
//       )
//     )
//   );

  
//     //  GetById: mantiene solo la ÚLTIMA petición (ideal para abrir/cambiar de detalle/diálogo)
//   getById$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(getRoleById),
//       mergeMap(({ id }) =>
//         this.roleService.getById(id).pipe(
//           map(role => setRoleById({ role })),
//           catchError(err => of(setRoleByIdError({ error: err?.message ?? 'Error cargando rol' })))
//         )
//       )
//     )
//   );

//     // Evita dobles clics mientras se está actualizando
//   update$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(updateRole),
//       exhaustMap(({ id, changes }) =>
//         this.roleService.update(id, changes).pipe(
//           map(role => updateRoleSuccess({ role })),
//           catchError(err => of(updateRoleError({ error: err?.message ?? 'Error actualizando rol' })))
//         )
//       )
//     )
//   );

//   //  Loading ON al iniciar GetById
//   setLoadingOn$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(getRoleById),
//       map(() => setRoleLoading({ loading: true }))
//     )
//   );

//   //  Loading OFF en éxito o error
//   setLoadingOffOnSuccess$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(setRoleById, setRoleByIdError),
//       map(() => setRoleLoading({ loading: false }))
//     )
//   );


// // exhaustMap: evita doble submit si apretan varias veces "Guardar"
//   create$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(createRole),
//       exhaustMap(({ role }) =>
//         this.roleService.create(role).pipe(
//           map(role => createRoleSuccess({ role })),
//           catchError(err => of(createRoleError({ error: err?.message ?? 'Error creando rol' })))
//         )
//       )
//     )
//   );

//   // Loading ON al iniciar
//   createLoadingOn$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(createRole),
//       map(() => setRoleLoading({ loading: true }))
//     )
//   );

//   // Loading OFF en éxito o error
//   createLoadingOff$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(createRoleSuccess, createRoleError),
//       map(() => setRoleLoading({ loading: false }))
//     )
//   );


//   //delete 

//   delete$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(deleteRole),
//       exhaustMap(({ id }) =>
//         this.roleService.delete(id).pipe(
//           map(() => deleteRoleSuccess({ id })),
//           catchError(err => of(deleteRoleError({ error: err?.message ?? 'Error eliminando rol' })))
//         )
//       )
//     )
//   );

//   // Loading ON al iniciar
//   deleteLoadingOn$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(deleteRole),
//       map(() => setRoleLoading({ loading: true }))
//     )
//   );

//   // Loading OFF al terminar
//   deleteLoadingOff$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(deleteRoleSuccess, deleteRoleError),
//       map(() => setRoleLoading({ loading: false }))
//     )
//   );




//   // Create → después recargo lista (simple como tu ejemplo)
//   // create$ = createEffect(() =>
//   //     this.actions$.pipe(
//   //         ofType(createRole),
//   //         mergeMap(({ role }) =>
//   //             this.roleService.create(role).pipe(
//   //                 mergeMap(() => [loadRoles()]),
//   //                 catchError(err => of(setRoleError({ error: err?.message ?? 'Error creando rol' })))
//   //             )
//   //         )
//   //     )
//   // );

//   // Update → recargo lista
//   // update$ = createEffect(() =>
//   //     this.actions$.pipe(
//   //         ofType(updateRole),
//   //         mergeMap(({ id, role }) =>
//   //             this.roleService.update(id, role).pipe(
//   //                 mergeMap(() => [loadRoles()]),
//   //                 catchError(err => of(setRoleError({ error: err?.message ?? 'Error actualizando rol' })))
//   //             )
//   //         )
//   //     )
//   // );

//   // Delete → recargo lista
//   // delete$ = createEffect(() =>
//   //     this.actions$.pipe(
//   //         ofType(deleteRole),
//   //         mergeMap(({ id }) =>
//   //             this.roleService.delete(id).pipe(
//   //                 mergeMap(() => [loadRoles()]),
//   //                 catchError(err => of(setRoleError({ error: err?.message ?? 'Error eliminando rol' })))
//   //             )
//   //         )
//   //     )
//   // );

//   // Apagar loading cuando llegan resultados o error
//   stopLoadingOnSet$ = createEffect(() =>
//     this.actions$.pipe(
//       ofType(setRoles, setRoleError),
//       map(() => setRoleLoading({ loading: false }))
//     )
//   );



// }


