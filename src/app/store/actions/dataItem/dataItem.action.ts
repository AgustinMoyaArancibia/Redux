import { createAction, props } from "@ngrx/store";
import { DataItemEntity } from "../../../api/entities/dataItems/dataItem.entity";


// cargar lista (paginado)
export const loadDataItem = createAction(
  '[DataItem] Load',
  props<{ page: number; size: number; search?: string | null; sortBy?: string | null; desc?: boolean }>()
);
export const loadDataItemSuccess = createAction(
  '[DataItem API] Load Success',
  props<{ items: DataItemEntity[]; total: number; page: number; size: number }>()
);
export const loadDataItemFail = createAction(
  '[DataItem API] Load Fail',
  props<{ error: string }>()
);

// set lista directa (opcional)
export const setDataItem = createAction(
  '[DataItem] Set',
  props<{ items: DataItemEntity[] }>()
);

// seleccionar uno
export const selectDataItem = createAction(
  '[DataItem] Select',
  props<{ selectedId: number | null }>()
);

// get by id
export const getDataItemById = createAction(
  '[DataItem] Get By Id',
  props<{ id: number }>()
);
export const setDataItemById = createAction(
  '[DataItem] Set By Id',
  props<{ project: DataItemEntity }>()
);
export const setDataItemByIdError = createAction(
  '[DataItem] Set By Id Error',
  props<{ error: string }>()
);

// ui flags
export const setDataItemLoading = createAction(
  '[DataItem] Set Loading',
  props<{ loading: boolean }>()
);
export const setDataItemError = createAction(
  '[DataItem] Set Error',
  props<{ error: string | null }>()
);

export const resetDataItem = createAction(
  '[DataItem] Reset State'
);
