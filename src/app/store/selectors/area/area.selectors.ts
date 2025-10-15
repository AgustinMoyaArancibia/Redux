import { createSelector } from "@ngrx/store";
import { AppState } from "../../app.state";

export const SelectAreaState = (state:AppState) => state.AreaState;



export const selectAreas      = createSelector(SelectAreaState, s => s.items);
export const selectAreaLoading= createSelector(SelectAreaState, s => s.loading);
export const selectAreaError  = createSelector(SelectAreaState, s => s.error);

export const selectSelectedAreaId = createSelector(SelectAreaState, s => s.selectedId);




export const selectPage  = createSelector(SelectAreaState, s => s.page);
export const selectSize  = createSelector(SelectAreaState, s => s.size);
export const selectTotal = createSelector(SelectAreaState, s => s.total);
export const selectTotalPages = createSelector(selectTotal, selectSize, (t, s) => Math.max(1, Math.ceil(t / s)));