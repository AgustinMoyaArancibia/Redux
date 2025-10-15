// src/app/store/actions/Managment/sector.actions.ts
import { createAction, props } from "@ngrx/store";
import { ManagmentEntity } from "../../../api/entities/sachManagements/managment.Entity";


export const loadManagment = createAction(
  "[Managment] Load Managment",
  props<{ idGerencia?: number | null }>()
);

export const loadManagmentSuccess = createAction(
  "[Managment] Load Managment Success",
  props<{ items: ManagmentEntity[] }>()
);

export const loadManagmentFailure = createAction(
  "[Managment] Load Managment Failure",
  props<{ error: string }>()
);

export const clearManagment = createAction("[Managment] Clear Managment");
