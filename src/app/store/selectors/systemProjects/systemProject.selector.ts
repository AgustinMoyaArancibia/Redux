import { createSelector } from "@ngrx/store";
import { AppState } from "../../app.state";

export const selectSystemProjectState = (state: AppState) => state.SystemProjectState;

export const selectSystemProjects       = createSelector(selectSystemProjectState, s => s.items);
export const selectSystemProjectLoading = createSelector(selectSystemProjectState, s => s.loading);
export const selectSystemProjectError   = createSelector(selectSystemProjectState, s => s.error);

export const selectSystemProjectPage    = createSelector(selectSystemProjectState, s => s.page);
export const selectSystemProjectSize    = createSelector(selectSystemProjectState, s => s.size);
export const selectSystemProjectTotal   = createSelector(selectSystemProjectState, s => s.total);
export const selectSystemProjectTotalPages = createSelector(
  selectSystemProjectTotal, selectSystemProjectSize,
  (t, s) => Math.max(1, Math.ceil(t / s))
);

export const selectSelectedSystemProjectId = createSelector(selectSystemProjectState, s => s.selectedId);
export const selectSelectedSystemProject = createSelector(
  selectSystemProjects,
  selectSelectedSystemProjectId,
  (items, id) => items.find(p => p.id === id) ?? null
);
