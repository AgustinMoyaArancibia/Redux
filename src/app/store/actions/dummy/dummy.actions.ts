import { createAction, props } from "@ngrx/store";
import { PokemonEntity } from "../../../api/entities/pokemons/pokemon.entity";

export const getDummyData = createAction(
    '[Dummy] Get Dummy Data', props<{ id: number }>()
)

export const setDummyData = createAction(
    '[Dummy] Set Dummy Data', props<{ data: PokemonEntity }>()
)

export const addDummyCounter = createAction(
    '[Dummy] Add Dummy Counter', props<{ counter: number }>()
)

export const ResetDummyData = createAction(
    '[Dummy] Reset Data'
)