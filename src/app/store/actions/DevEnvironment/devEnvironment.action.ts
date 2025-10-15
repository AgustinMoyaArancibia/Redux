// import { createAction, props } from "@ngrx/store";
// import { DevEnvironmentEntity } from "../../../api/entities/devEnvironments/devEnvironment.entity";

// //cargar lista 
// export const loadDevEnvironments = createAction(
//   '[DevEnvironment] Load',
//   props<{ page: number; size: number; search?: string | null; sortBy?: string | null; desc?: boolean }>()
// );
// export const loadDevEnvironmentsSuccess = createAction(
//   '[DevEnvironment API] Load Success',
//   props<{ items: DevEnvironmentEntity[]; total: number; page: number; size: number }>()
// );

// export const loadDevEnvironmentsFail = createAction(
//   '[DevEnvironment API] Load Fail',
//   props<{ error: string }>()
// );

// export const setRoleLoading = createAction('[DevEnvironment] Set Loading', props<{ loading: boolean }>());
// export const setRoleError = createAction('[DevEnvironment] Set Error', props<{ error: string | null }>());
// export const resetRoleState = createAction('[DevEnvironment] Reset State');