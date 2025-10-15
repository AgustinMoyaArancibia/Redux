// import { createSelector } from "@ngrx/store";
// import { AppState } from "../../app.state";

// export const SelectDevEnvironment = (state:AppState) =>state.DevEnvironment;



// export const selectDevEnvironments      = createSelector(SelectDevEnvironment, s => s.items);
// export const selectDevEnvironmentLoading= createSelector(SelectDevEnvironment, s => s.loading);
// export const selectDevEnvironmentError  = createSelector(SelectDevEnvironment, s => s.error);

// export const selectSelectedRoleId = createSelector(SelectDevEnvironment, s => s.selectedId);
// export const selectSelectedRole   = createSelector(
//   selectDevEnvironments,
//   selectSelectedRoleId,
//   (items, id) => items.find(r => r.id === id) ?? null
// );



// export const selectPage  = createSelector(SelectDevEnvironment, s => s.page);
// export const selectSize  = createSelector(SelectDevEnvironment, s => s.size);
// export const selectTotal = createSelector(SelectDevEnvironment, s => s.total);
// export const selectTotalPages = createSelector(selectTotal, selectSize, (t, s) => Math.max(1, Math.ceil(t / s)));