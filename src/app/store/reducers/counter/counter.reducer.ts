import { createReducer, on } from "@ngrx/store";
import { addDummyCounter, ResetDummyData } from "../../actions/dummy/dummy.actions";
import { counterInitialState } from "../../states/counter/counter.state";

export const CounterReducer = createReducer(
    counterInitialState,

    on(addDummyCounter, (state, { counter }) => {
        return state + counter
    }),

    on(ResetDummyData, (state) => {
        return counterInitialState
    })
)