// src/app/store/reducers/Managments/sector.reducer.ts
import { createReducer, on } from "@ngrx/store";
import { initialManagmentState } from "../../../api/entities/sachManagements/managmentState";
import { clearManagment, loadManagment, loadManagmentFailure, loadManagmentSuccess } from "../../actions/sachManagment/managment.action";



export const ManagmentReducer = createReducer(
  initialManagmentState,

  on(loadManagment, (state, { idGerencia }) => ({
    ...state,
    loading: true,
    error: null,
    idGerencia: idGerencia ?? null
  })),

  on(loadManagmentSuccess, (state, { items }) => ({
    ...state,
    loading: false,
    items
  })),

  on(loadManagmentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(clearManagment, (state) => ({
    ...state,
    items: [],
    error: null
  }))
);
