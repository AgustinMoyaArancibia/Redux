// src/app/core/services/sachSectors/sector.service.ts
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { SectorEntity } from "../../../api/entities/sachSectors/SectorEntity";
import { AbstractSectorProvider } from "../../../api/providers/sachSectors/sector.abstract";

@Injectable({ providedIn: "root" })
export class SectorService {
  private provider = inject(AbstractSectorProvider);

  /** Devuelve todos los sectores (opcionalmente filtrados por gerencia) */
  getAll(idGerencia?: number | null): Observable<SectorEntity[]> {
    return this.provider.getAll(idGerencia ?? null);
  }
}
