import { AreaEffects } from "./area/area.effects";
import { AuthEffects } from "./auth/auth.effects";
import { DataItemEffects } from "./dataItem/dataItem.effects";
// import { DevEnvironmentEffects } from "./DevEnvironment/devEnvironment.effects";
import { DummyEffects } from "./dummy/dummy.effects";
import { LogEffects } from "./logs/log.effects";
import { ManagmentEffects } from "./sachManagment/managment.effects";
import { SectorEffects } from "./sachSectors/sector.effects";
// import { RoleEffects } from "./roles/role.effects";
import { SystemInfoEffects } from "./systemInfos/systemInfo.effects";
import { SystemProjectEffects } from "./systemProjects/systemProject.effects";

export const effects = [
    //AGREGAR LOS EFFECTS AQUÍ
    DummyEffects,
    // RoleEffects,
    // DevEnvironmentEffects,
    AreaEffects, SystemProjectEffects, SystemInfoEffects, AuthEffects, DataItemEffects, SectorEffects, ManagmentEffects, LogEffects
]