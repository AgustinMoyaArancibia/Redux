import { createAction, props } from "@ngrx/store";
import { SystemProjectEntity } from "../../../api/entities/systemProjects/systemProject.entity";

// cargar lista (paginado)
export const loadSystemProjects = createAction(
  '[SystemProject] Load',
  props<{ page: number; size: number; search?: string | null; sortBy?: string | null; desc?: boolean }>()
);
export const loadSystemProjectsSuccess = createAction(
  '[SystemProject API] Load Success',
  props<{ items: SystemProjectEntity[]; total: number; page: number; size: number }>()
);
export const loadSystemProjectsFail = createAction(
  '[SystemProject API] Load Fail',
  props<{ error: string }>()
);

// set lista directa (opcional)
export const setSystemProjects = createAction(
  '[SystemProject] Set',
  props<{ items: SystemProjectEntity[] }>()
);

// seleccionar uno
export const selectSystemProject = createAction(
  '[SystemProject] Select',
  props<{ selectedId: number | null }>()
);

// get by id
export const getSystemProjectById = createAction(
  '[SystemProject] Get By Id',
  props<{ id: number }>()
);
export const setSystemProjectById = createAction(
  '[SystemProject] Set By Id',
  props<{ project: SystemProjectEntity }>()
);
export const setSystemProjectByIdError = createAction(
  '[SystemProject] Set By Id Error',
  props<{ error: string }>()
);

// ui flags
export const setSystemProjectLoading = createAction(
  '[SystemProject] Set Loading',
  props<{ loading: boolean }>()
);
export const setSystemProjectError = createAction(
  '[SystemProject] Set Error',
  props<{ error: string | null }>()
);

export const resetSystemProjectState = createAction(
  '[SystemProject] Reset State'
);


// cargar lista de UNLINKED (sin paginado)
export const loadSystemProjectsUnlinked = createAction(
  '[SystemProject] Load Unlinked'
);
export const loadSystemProjectsUnlinkedSuccess = createAction(
  '[SystemProject API] Load Unlinked Success',
  props<{ items: SystemProjectEntity[] }>()
);
export const loadSystemProjectsUnlinkedFail = createAction(
  '[SystemProject API] Load Unlinked Fail',
  props<{ error: string }>()
);