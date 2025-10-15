// src/app/api/providers/sachSectors/sector.provider.ts
import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

import { ServiceResult } from "../../../modules/commont";
import { mapSectorDtoToEntity } from "../../../core/mappers/mapSectorDtoToEntity";
import { ManagmentEntity } from "../../entities/sachManagements/managment.Entity";
import { AbstractManagmentProvider } from "./managment.abstract";
import { mapManagmentDtoToEntity } from "../../../core/mappers/managmentDtoToEntity";




@Injectable({ providedIn: "root" })
export class ManagmentProvider extends AbstractManagmentProvider {
  private http = inject(HttpClient);
  private baseUrl = "/api"; // o environment.apiUrl

  override getAll(): Observable<ManagmentEntity[]> {
    let params = new HttpParams();

    return this.http
      .get<ServiceResult<any[]>>(`${this.baseUrl}/sach/departments`, { params })
      .pipe(
        map(r => r?.data ?? []),
        map(arr => arr.map(mapManagmentDtoToEntity))
      );
  }
}
