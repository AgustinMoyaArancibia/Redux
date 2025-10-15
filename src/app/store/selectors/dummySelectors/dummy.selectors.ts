import { createSelector } from "@ngrx/store";
import { AppState } from "../../app.state";

export const SelectDummyState = (state: AppState) => state.DummyState;

export const selectPokemonName = createSelector(SelectDummyState, (state) => {
    return state[state.length - 1].name;
})