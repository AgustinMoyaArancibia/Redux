// src/app/api/providers/sachSectors/sector.abstract.ts
import { Observable } from "rxjs";
import { SectorEntity } from "../../entities/sachSectors/SectorEntity";

export abstract class AbstractSectorProvider {
  abstract getAll(idGerencia?: number | null): Observable<SectorEntity[]>;
}
