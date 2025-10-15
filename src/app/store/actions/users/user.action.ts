import { createAction, props } from "@ngrx/store"
import { UserReadEntity } from "../../../api/entities/users/user-read.entity";

export const getDummyData = createAction(
    'load Paged', props<{ pageIndex: number, pageSize: number, search?: string | null; sortBy?: string | null; desc?: boolean }>()
)

export const getDummyDataSuccess = createAction(
    'load paged Success', props<{ items: UserReadEntity[]; total: number; page: number; size: number }>()
)

export const getDummyDataFailure = createAction(
    'load paged Failure', props<{ error: any }>()
)


// export const setDummyData = createAction(
//     '[Dummy] Set Dummy Data', props<{ data: PokemonEntity }>()
// )

// export const addDummyCounter = createAction(
//     '[Dummy] Add Dummy Counter', props<{ counter: number }>()
// )

// export const ResetDummyData = createAction(
//     '[Dummy] Reset Data'
// )