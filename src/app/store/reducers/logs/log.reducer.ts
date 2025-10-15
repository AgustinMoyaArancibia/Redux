import { createReducer, on } from "@ngrx/store";
import { InitialStateArea } from "../../states/area/area.state";
import { InitialStateLog } from "../../states/logs/log.state";
import { loadLogs, loadLogsFail, loadLogsSuccess } from "../../actions/logs/log.action";

export const LogReducer = createReducer(

  InitialStateLog,

  on(loadLogs, (state, { page, size, search = null, sortBy = null, desc = false }) => ({
    ...state,
    page, size, search, sortBy, desc,
    loading: true,
    error: null
  })),



  on(loadLogsFail, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(loadLogsSuccess, (state, { items, total, page, size }) => ({
    ...state,
    items: items ?? [],          // ⬅️ evita dejar undefined
    total: total ?? 0,
    page: page ?? state.page,
    size: size ?? state.size,
    loading: false,
    error: null
  })),


)