// src/app/api/providers/sachSectors/sector.provider.ts
import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { AbstractSectorProvider } from "./sector.abstract";
import { SectorEntity } from "../../entities/sachSectors/SectorEntity";
import { ServiceResult } from "../../../modules/commont";
import { mapSectorDtoToEntity } from "../../../core/mappers/mapSectorDtoToEntity";




@Injectable({ providedIn: "root" })
export class SectorProvider extends AbstractSectorProvider {
  private http = inject(HttpClient);
  private baseUrl = "/api"; // o environment.apiUrl

  override getAll(idGerencia?: number | null): Observable<SectorEntity[]> {
    let params = new HttpParams();
    if (idGerencia != null) params = params.set("idGerencia", idGerencia);

    return this.http
      .get<ServiceResult<any[]>>(`${this.baseUrl}/sach/sectors`, { params })
      .pipe(
        map(r => r?.data ?? []),
        map(arr => arr.map(mapSectorDtoToEntity))
      );
  }
}
