import { createSelector } from "@ngrx/store";
import { AppState } from "../../app.state";

export const SelectLogState = (state:AppState) => state.LogState;



export const selectLogs      = createSelector(SelectLogState, s => s.items);
export const selectLogLoading= createSelector(SelectLogState, s => s.loading);
export const selectLogError  = createSelector(SelectLogState, s => s.error);

export const selectSelectedLogId = createSelector(SelectLogState, s => s.selectedId);




export const selectPage  = createSelector(SelectLogState, s => s.page);
export const selectSize  = createSelector(SelectLogState, s => s.size);
export const selectTotal = createSelector(SelectLogState, s => s.total);
export const selectTotalPages = createSelector(selectTotal, selectSize, (t, s) => Math.max(1, Math.ceil(t / s)));