import { createReducer, on } from "@ngrx/store";
import { InitialStateSystemProject } from "../../states/systemProjects/systemProject.state";
import {
    loadSystemProjects,
    loadSystemProjectsFail,
    loadSystemProjectsSuccess,
    loadSystemProjectsUnlinked,
    loadSystemProjectsUnlinkedFail,
    loadSystemProjectsUnlinkedSuccess,
    resetSystemProjectState,
    selectSystemProject,
    setSystemProjectById,
    setSystemProjectByIdError,
    setSystemProjectError,
    setSystemProjectLoading,
    setSystemProjects,

} from "../../actions/systemProjects/systemProject.action";

export const SystemProjectReducer = createReducer(
    InitialStateSystemProject,

    // load (lista)
    on(loadSystemProjects, (state, { page, size, search = null, sortBy = null, desc = false }) => ({
        ...state, page, size, search, sortBy, desc, loading: true, error: null
    })),
    on(loadSystemProjectsSuccess, (state, { items, total, page, size }) => ({
        ...state, items, total, page, size, loading: false, error: null
    })),
    on(loadSystemProjectsFail, (state, { error }) => ({ ...state, loading: false, error })),

    // set by id
    on(setSystemProjectById, (state, { project }) => ({
        ...state,
        items: [
            ...state.items.filter(p => p.id !== project.id),
            project
        ],
        selectedId: project.id,
        error: null
    })),
    on(setSystemProjectByIdError, (state, { error }) => ({ ...state, error })),


    // ui flags
    on(setSystemProjectLoading, (state, { loading }) => ({
        ...state, loading, error: loading ? null : state.error
    })),
    on(setSystemProjects, (state, { items }) => ({ ...state, items, error: null })),
    on(selectSystemProject, (state, { selectedId }) => ({ ...state, selectedId })),
    on(setSystemProjectError, (state, { error }) => ({ ...state, error })),

    // reset
    on(resetSystemProjectState, () => InitialStateSystemProject),

     // UNLINKED load → loading ON
  on(loadSystemProjectsUnlinked, (state) => ({
    ...state, loading: true, error: null
  })),
  // UNLINKED success → set items (sin paginado)
  on(loadSystemProjectsUnlinkedSuccess, (state, { items }) => ({
    ...state,
    items,
    total: items.length,
    page: 1,
    size: items.length || 20,
    loading: false,
    error: null
  })),
  // UNLINKED fail
  on(loadSystemProjectsUnlinkedFail, (state, { error }) => ({
    ...state, loading: false, error
  })),
);
