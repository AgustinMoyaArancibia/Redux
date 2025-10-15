// store/selectors/dataItem/dataItem.selector.ts
import { createSelector } from "@ngrx/store";
import { AppState } from "../../app.state";

export const SelectDataItem = (state: AppState) => state.DataItemState; // ✅ clave correcta

export const selectDataItems       = createSelector(SelectDataItem, s => s?.items ?? []);
export const selectDataItemLoading = createSelector(SelectDataItem, s => !!s?.loading);
export const selectDataItemError   = createSelector(SelectDataItem, s => s?.error ?? null);

export const selectSelectedDataItemId = createSelector(SelectDataItem, s => s?.selectedId ?? null);
export const selectSelectedDataItem   = createSelector(
  selectDataItems,
  selectSelectedDataItemId,
  (items, id) => items.find(r => r.id === id) ?? null
);

export const selectPage       = createSelector(SelectDataItem, s => s?.page ?? 1);
export const selectSize       = createSelector(SelectDataItem, s => s?.size ?? 20);
export const selectTotal      = createSelector(SelectDataItem, s => s?.total ?? 0);
export const selectTotalPages = createSelector(selectTotal, selectSize, (t, s) => Math.max(1, Math.ceil(t / s)));
