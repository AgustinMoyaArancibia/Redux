import { createAction, props } from "@ngrx/store";
import { LogEntity } from "../../../api/entities/logs/log.entity";

export const loadLogs = createAction(
  '[Log] Load',
  props<{ page: number; size: number; search?: string | null; sortBy?: string | null; desc?: boolean }>()
);
export const loadLogsSuccess = createAction(
  '[Log API] Load Success',
  props<{ items: LogEntity[]; total: number; page: number; size: number }>()
);

export const loadLogsFail = createAction(
  '[Log API] Load Fail',
  props<{ error: string }>()
);