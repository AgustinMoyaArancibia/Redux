import { createSelector } from "@ngrx/store";
import { AppState } from "../../app.state";

export const SelectCounter = (state: AppState) => state.CounterState;
export const selectCounter = createSelector(
    SelectCounter,
    (state) => state
)