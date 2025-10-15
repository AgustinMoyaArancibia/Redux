import { AbstractAreaProvider } from "./area/area.abstract";
import { AreaProvider } from "./area/area.provider";
import { AbstractAuthProvider } from "./auth/auth.abstract";
import { AuthProvider } from "./auth/auth.provider";
import { AbstractDataItemProvider } from "./dataItems/dataItem.abstract";
import { DataItemProvider } from "./dataItems/dataItem.provider";
import { AbstractDummyProvider } from "./dummy/dummy.abstract";
import { DummyMockProvider } from "./dummy/dummy.mockprovider";
import { AbstractLogProvider } from "./log/log.abstract";
import { LogProvider } from "./log/log.provider";
import { AbstractManagmentProvider } from "./sachManagments/managment.abstract";
import { ManagmentProvider } from "./sachManagments/managment.provider";
import { AbstractSectorProvider } from "./sachSectors/sector.abstract";
import { SectorProvider } from "./sachSectors/sector.provider";
import { AbstractSystemInfoProvider } from "./systemInfos/systemInfo.abstract";
import { SystemInfoProvider } from "./systemInfos/systemInfo.provider";
import { AbstractSystemProjectProvider } from "./systemProject/systemProject.abstract";
import { SystemProjectProvider } from "./systemProject/systemProject.provider";

export const providers = [
  { provide: AbstractDummyProvider, useClass: DummyMockProvider },
   { provide: AbstractSectorProvider, useClass: SectorProvider },
  { provide: AbstractAreaProvider, useClass: AreaProvider },
  { provide: AbstractSystemProjectProvider, useClass: SystemProjectProvider },
   { provide: AbstractSystemInfoProvider, useClass: SystemInfoProvider },
   { provide: AbstractAuthProvider, useClass: AuthProvider },
   { provide: AbstractDataItemProvider, useClass: DataItemProvider },
   { provide: AbstractManagmentProvider, useClass: ManagmentProvider },
   { provide: AbstractLogProvider, useClass: LogProvider }
];