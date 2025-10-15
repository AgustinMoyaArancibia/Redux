import { createAction, props } from "@ngrx/store";
// import { RoleEntity } from "../../../api/entities/roles/role.entity";
import { AreaEntity } from "../../../api/entities/areas/area.entity";

//cargar lista 
export const loadAreas = createAction(
  '[Area] Load',
  props<{ page: number; size: number; search?: string | null; sortBy?: string | null; desc?: boolean }>()
);
export const loadAreasSuccess = createAction(
  '[Area API] Load Success',
  props<{ items: AreaEntity[]; total: number; page: number; size: number }>()
);

export const loadAreasFail = createAction(
  '[Area API] Load Fail',
  props<{ error: string }>()
);

//eliminar data item

