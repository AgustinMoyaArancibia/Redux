// import { createReducer, on } from "@ngrx/store";
// import { InitialStateDevEnvironmente } from "../../states/DevEnvironment/devEnvironment.state";
// import { loadDevEnvironments, loadDevEnvironmentsFail, loadDevEnvironmentsSuccess } from "../../actions/DevEnvironment/devEnvironment.action";

// export const DevEnvironmentReducer = createReducer(

// InitialStateDevEnvironmente,


//   on(loadDevEnvironments, (state, { page, size, search = null, sortBy = null, desc = false }) => ({
//     ...state,
//     page, size, search, sortBy, desc,
//     loading: true,
//     error: null
//   })),

//   on(loadDevEnvironmentsSuccess, (state, { items, total, page, size }) => ({
//     ...state,
//     items, total, page, size,
//     loading: false,
//     error: null
//   })),

//   on(loadDevEnvironmentsFail, (state, { error }) => ({
//     ...state,
//     loading: false,
//     error
//   })),



// )