// src/app/api/providers/sachSectors/sector.abstract.ts
import { Observable } from "rxjs";
import { SectorEntity } from "../../entities/sachSectors/SectorEntity";
import { ManagmentEntity } from "../../entities/sachManagements/managment.Entity";

export abstract class AbstractManagmentProvider {
  abstract getAll(): Observable<ManagmentEntity[]>;
}
