import { ActionReducer, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { CounterReducer } from './reducers/counter/counter.reducer';
import { DummyReducer } from './reducers/dummy/dummy.reducer';
import { trialReducer } from './reducers/trial.reducer';
// import { RoleReducer } from './reducers/roles/role.reducer';
// import { DevEnvironmentReducer } from './reducers/DevEnvironment/devEnvironment.reducer';
import { AreaReducer } from './reducers/area/area.reducer';
import { SystemProjectReducer } from './reducers/systemProjects/systemProject.reducer';
import { SystemInfoReducer } from './reducers/systemInfos/systemInfo.reducer';
import { AuthReducer } from './reducers/auth/auth.reducer';
import { DataItemReducer } from './reducers/dataItem/dataItem.reducer';
import { sectorReducer } from './reducers/sachSectors/sector.reducer';
import { ManagmentReducer } from './reducers/sachManagment/managment.reducer';
import { LogReducer } from './reducers/logs/log.reducer';

//Definicion de los reducers
export const reducers = {
    TrialState: trialReducer,
    DummyState: DummyReducer,
    CounterState: CounterReducer,
    // RoleState: RoleReducer,
    // DevEnvironmentState: DevEnvironmentReducer,
    AreaState: AreaReducer,
    SystemProjectState: SystemProjectReducer,
    SystemInfoState: SystemInfoReducer,
    AuthState:AuthReducer,
    DataItemState:DataItemReducer,
    sectors: sectorReducer,
    managment:ManagmentReducer,
    LogState : LogReducer
}


// Funcion que sincroniza el store con el localStorage, todas las keys
// Que se definan en el localStorageSync se guardaran en el localStorage
// export function localStorageSyncReducer(reducer: ActionReducer<any>) {
//     return localStorageSync({
//         keys: [],   //keys = nombre modulo del state  //'DummyState'
//         rehydrate: true,
//     })(reducer);
// }

// /* 3. MetaReducers condicionales ----------------------------------------- */
// export const metaReducers: MetaReducer[] =
//     typeof window !== 'undefined'  // true sólo en el browser
//         ? [localStorageSyncReducer]
//         : [];