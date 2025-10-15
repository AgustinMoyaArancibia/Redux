import { AreaState } from "../api/entities/areas/areaState.entity";
import { AuthState } from "../api/entities/auth/authState.entity";
import { DataItemState } from "../api/entities/dataItems/dataItemState.entity";
import { LogState } from "../api/entities/logs/logState.entity";
// import { DevEnvironmentState } from "../api/entities/devEnvironments/devEnvironmentState.entity";
import { PokemonEntity } from "../api/entities/pokemons/pokemon.entity";
import { ManagmentState } from "../api/entities/sachManagements/managmentState";
import { SectorState } from "../api/entities/sachSectors/sectorState";
// import { RoleState } from "../api/entities/roles/roleState.entity";
import { SystemInfoState } from "../api/entities/systemInfos/systemInfoState.entity";
import { SystemProjectState } from "../api/entities/systemProjects/systemProjectState.entity";
import { UserEntity } from "../api/entities/users/user.entity";

export interface AppState {
  TrialState: any;
  DummyState: PokemonEntity[]
  CounterState: number;
  UserState: UserEntity[];
  // RoleState: RoleState;
  // DevEnvironment: DevEnvironmentState;
  AreaState: AreaState
  SystemProjectState: SystemProjectState;
  SystemInfoState: SystemInfoState;
  AuthState: AuthState;
  DataItemState: DataItemState;
  sectors: SectorState;
  managment: ManagmentState;
  LogState : LogState;
}