// import { Component, inject } from '@angular/core';
// import { AppState } from '../../../store/app.state';
// import { selectRoleError, selectRoleLoading, selectRoles } from '../../../store/selectors/roles/role.selectors';
// import { Store } from '@ngrx/store';
// import { createRole, deleteRole, getRoleById, loadRoles, selectRole, updateRole } from '../../../store/actions/roles/role.action';

// @Component({
//   selector: 'app-roles.page.ts',
//   standalone: true,
//   imports: [],
//   templateUrl: './roles.page.ts.component.html',
//   styleUrl: './roles.page.ts.component.scss'
// })
// export class RolesPageComponent {


//   // roles.page.ts
//   private store = inject<Store<AppState>>(Store);

//   roles$ = this.store.select(selectRoles);
//   loading$ = this.store.select(selectRoleLoading);
//   error$ = this.store.select(selectRoleError);

//  ngOnInit() {

//   this.store.dispatch(loadRoles({ page: 1, size: 20, search: null, sortBy: null, desc: false }));
//   // this.store.dispatch(getRoleById({id:1}))
//   // this.store.dispatch(updateRole({id:1 , changes: {description : "admin2" }}))
// }

//   // onSelect(id: number) {
//   //   this.store.dispatch(selectRole({ selectedId }));
//   // }

//   // onCreate(description: string) {
//   //   this.store.dispatch(createRole({ role: { description } }));
//   // }

// onCreate(description: string) {
//   this.store.dispatch(createRole({ role: { description } }));
// }
// confirmDelete(id: number) {
//   // acá podrías abrir un diálogo de confirmación
//   this.store.dispatch(deleteRole({ id }));
// }


// }
