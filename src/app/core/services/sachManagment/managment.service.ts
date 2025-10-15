// src/app/core/services/sachSectors/sector.service.ts
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { SectorEntity } from "../../../api/entities/sachSectors/SectorEntity";
import { AbstractSectorProvider } from "../../../api/providers/sachSectors/sector.abstract";
import { AbstractManagmentProvider } from "../../../api/providers/sachManagments/managment.abstract";
import { ManagmentEntity } from "../../../api/entities/sachManagements/managment.Entity";

@Injectable({ providedIn: "root" })
export class ManagmentService {
  private provider = inject(AbstractManagmentProvider);

  /** Devuelve todos los sectores (opcionalmente filtrados por gerencia) */
  getAll(): Observable<ManagmentEntity[]> {
    return this.provider.getAll();
  }
}
