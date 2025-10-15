// import { createReducer, on, select } from "@ngrx/store";
// import { create } from "domain";
// import { InitialStateRole } from "../../states/roles/role.state";
// import { createRoleError, createRoleSuccess, deleteRoleError, deleteRoleSuccess, loadRoles, loadRolesFail, loadRolesSuccess, resetRoleState, selectRole, setRoleById, setRoleByIdError, setRoleError, setRoleLoading, setRoles, updateRoleError, updateRoleSuccess } from "../../actions/roles/role.action";


// export const RoleReducer = createReducer(

//   InitialStateRole,


//   on(loadRoles, (state, { page, size, search = null, sortBy = null, desc = false }) => ({
//     ...state,
//     page, size, search, sortBy, desc,
//     loading: true,
//     error: null
//   })),

//   on(loadRolesSuccess, (state, { items, total, page, size }) => ({
//     ...state,
//     items, total, page, size,
//     loading: false,
//     error: null
//   })),

//   on(loadRolesFail, (state, { error }) => ({
//     ...state,
//     loading: false,
//     error
//   })),


//   //select one 

//   on(setRoleById, (state, { role }) => ({
//     ...state,
//     // opcional: cachearlo en items (update/insert)
//     items: [
//       ...state.items.filter(r => r.id !== role.id),
//       role
//     ],
//     selectedId: role.id,
//     error: null
//   })),

//   on(setRoleByIdError, (state, { error }) => ({
//     ...state,
//     error
//   })),



//   //update
//   on(updateRoleSuccess, (state, { role }) => ({
//     ...state,
//     items: state.items.some(r => r.id === role.id)
//       ? state.items.map(r => (r.id === role.id ? role : r))
//       : [...state.items, role],
//     selectedId: role.id,
//     error: null
//   })),
//   on(updateRoleError, (state, { error }) => ({ ...state, error })),


//   // create 
//   on(createRoleSuccess, (state, { role }) => ({
//     ...state,
//     // lo agrego al principio; ajustá si querés al final
//     items: [role, ...state.items],
//     selectedId: role.id,
//     error: null
//   })),

//   on(createRoleError, (state, { error }) => ({
//     ...state,
//     error
//   })),


//   //delete

//     on(setRoleLoading, (state, { loading }) => ({
//     ...state,
//     loading,
//     error: loading ? null : state.error
//   })),

//   on(deleteRoleSuccess, (state, { id }) => {
//     const items = state.items.filter(r => r.id !== id);
//     const selectedId = state.selectedId === id ? null : state.selectedId;
//     const total = Math.max(0, (state.total ?? 0) - 1); // si llevás total
//     return { ...state, items, selectedId, total, error: null };
//   }),

//   on(deleteRoleError, (state, { error }) => ({
//     ...state,
//     error
//   })),








//   on(setRoleLoading, (state, { loading }) => ({
//     ...state, // mantengo todo lo que ya tenía
//     loading, // actualizo loading
//     error: loading ? null : state.error // si estoy cargando, limpio el error
//   })),


//   on(setRoles, (state, { roles }) => ({
//     ...state, // mantengo todo lo que ya tenía
//     items: roles, // actualizo items
//     error: null // limpio el error
//   })),

//   on(selectRole, (state, { selectedId }) => ({
//     ...state,
//     selectedId: selectedId
//   })),


//   on(setRoleError, (state, { error }) => ({
//     ...state,
//     error
//   })),

//   on(resetRoleState, () => InitialStateRole),

// )