// import { createSelector } from "@ngrx/store";
// import { AppState } from "../../app.state";


// export const SelectRolState = (state:AppState) => state.RoleState;




// export const selectRoles      = createSelector(SelectRolState, s => s.items);
// export const selectRoleLoading= createSelector(SelectRolState, s => s.loading);
// export const selectRoleError  = createSelector(SelectRolState, s => s.error);

// export const selectSelectedRoleId = createSelector(SelectRolState, s => s.selectedId);
// export const selectSelectedRole   = createSelector(
//   selectRoles,
//   selectSelectedRoleId,
//   (items, id) => items.find(r => r.id === id) ?? null
// );



// export const selectPage  = createSelector(SelectRolState, s => s.page);
// export const selectSize  = createSelector(SelectRolState, s => s.size);
// export const selectTotal = createSelector(SelectRolState, s => s.total);
// export const selectTotalPages = createSelector(selectTotal, selectSize, (t, s) => Math.max(1, Math.ceil(t / s)));