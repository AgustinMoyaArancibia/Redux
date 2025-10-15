// src/app/store/reducers/sectors/sector.reducer.ts
import { createReducer, on } from "@ngrx/store";
import { initialSectorState } from "../../../api/entities/sachSectors/sectorState";
import { loadSectors, loadSectorsSuccess, loadSectorsFailure, clearSectors } from "../../actions/sachSectors/sector.actions";


export const sectorReducer = createReducer(
  initialSectorState,

  on(loadSectors, (state, { idGerencia }) => ({
    ...state,
    loading: true,
    error: null,
    idGerencia: idGerencia ?? null
  })),

  on(loadSectorsSuccess, (state, { items }) => ({
    ...state,
    loading: false,
    items
  })),

  on(loadSectorsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(clearSectors, (state) => ({
    ...state,
    items: [],
    error: null
  }))
);
