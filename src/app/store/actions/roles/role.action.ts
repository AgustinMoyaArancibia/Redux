
// import { createAction, props } from "@ngrx/store";
// import { RoleEntity } from "../../../api/entities/roles/role.entity";
// import { RoleUpdateEntity } from "../../../api/entities/roles/RoleUpdate.entity";
// import { RoleCreateEntity } from "../../../api/entities/roles/roleCreate.entity";

// //cargar lista 
// export const loadRoles = createAction(
//   '[Role] Load',
//   props<{ page: number; size: number; search?: string | null; sortBy?: string | null; desc?: boolean }>()
// );
// export const loadRolesSuccess = createAction(
//   '[Role API] Load Success',
//   props<{ items: RoleEntity[]; total: number; page: number; size: number }>()
// );

// export const loadRolesFail = createAction(
//   '[Role API] Load Fail',
//   props<{ error: string }>()
// );


// export const setRoles = createAction(
//   '[Role] Set Roles',
//   props<{ roles: RoleEntity[] }>()
// )

// //seleccionar uno
// export const selectRole = createAction(
//   '[Role] Select Role',
//   props<{ selectedId: number | null }>()
// )

// //select one
// export const getRoleById = createAction(
//   '[Roles] Get By Id',
//   props<{ id: number }>()
// );

// export const setRoleById = createAction(
//   '[Roles] Set By Id',
//   props<{ role: RoleEntity }>()
// );

// export const setRoleByIdError = createAction(
//   '[Roles] Set By Id Error',
//   props<{ error: string }>()
// );


// //update
// export const updateRole = createAction(
//   '[Roles] Update',
//   props<{ id: number; changes: RoleUpdateEntity }>()
// );

// export const updateRoleSuccess = createAction(
//   '[Roles] Update Success',
//   props<{ role: RoleEntity }>()
// );

// export const updateRoleError = createAction(
//   '[Roles] Update Error',
//   props<{ error: string }>()
// );

// //create
// export const createRole = createAction(
//   '[Roles] Create',
//   props<{ role: RoleCreateEntity }>()
// );

// export const createRoleSuccess = createAction(
//   '[Roles] Create Success',
//   props<{ role: RoleEntity }>()
// );

// export const createRoleError = createAction(
//   '[Roles] Create Error',
//   props<{ error: string }>()
// );


// //delete

// export const deleteRole = createAction(
//   '[Role] Delete Role',
//   props<{ id: number }>()
// )


// export const deleteRoleSuccess = createAction('[Roles] Delete ', props<{ id: number }>());

// export const deleteRoleError = createAction(
//   '[Roles] Delete Error',
//   props<{ error: string }>()
// );



// export const setRoleLoading = createAction('[Role] Set Loading', props<{ loading: boolean }>());
// export const setRoleError = createAction('[Role] Set Error', props<{ error: string | null }>());
// export const resetRoleState = createAction('[Role] Reset State');