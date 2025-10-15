// src/app/store/actions/sectors/sector.actions.ts
import { createAction, props } from "@ngrx/store";
import { SectorEntity } from "../../../api/entities/sachSectors/SectorEntity";

export const loadSectors = createAction(
  "[Sectors] Load Sectors",
  props<{ idGerencia?: number | null }>()
);

export const loadSectorsSuccess = createAction(
  "[Sectors] Load Sectors Success",
  props<{ items: SectorEntity[] }>()
);

export const loadSectorsFailure = createAction(
  "[Sectors] Load Sectors Failure",
  props<{ error: string }>()
);

export const clearSectors = createAction("[Sectors] Clear Sectors");
