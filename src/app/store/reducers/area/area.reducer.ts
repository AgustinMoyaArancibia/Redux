import { createReducer, on } from "@ngrx/store";
import { InitialStateArea } from "../../states/area/area.state";
import { loadAreas, loadAreasFail, loadAreasSuccess } from "../../actions/areas/area.action";

export const AreaReducer = createReducer(

  InitialStateArea,

  on(loadAreas, (state, { page, size, search = null, sortBy = null, desc = false }) => ({
    ...state,
    page, size, search, sortBy, desc,
    loading: true,
    error: null
  })),



  on(loadAreasFail, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(loadAreasSuccess, (state, { items, total, page, size }) => ({
    ...state,
    items: items ?? [],          // ⬅️ evita dejar undefined
    total: total ?? 0,
    page: page ?? state.page,
    size: size ?? state.size,
    loading: false,
    error: null
  })),


)