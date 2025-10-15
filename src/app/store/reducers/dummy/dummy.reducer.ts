import { createReducer, on } from "@ngrx/store";
import { ResetDummyData, setDummyData } from "../../actions/dummy/dummy.actions";
import { InitialStateDummy } from "../../states/dummy/dummy.state";

export const DummyReducer = createReducer(
    InitialStateDummy,

    on(setDummyData, (state, { data }) => {
        let newState = [...state.filter((p) => p.name !== ""), data];

        return newState;
    }),

    on(ResetDummyData, (state) => {
        return InitialStateDummy
    })
)