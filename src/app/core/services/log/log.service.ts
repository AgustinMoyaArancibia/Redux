import { Injectable } from "@angular/core";
import { AbstractAreaProvider } from "../../../api/providers/area/area.abstract";
import { AreaEntity } from "../../../api/entities/areas/area.entity";
import { PagedResult } from "../../../modules/commont";
import { map, Observable } from "rxjs";
import { PagedRequest } from "../../models/common/common";
import { AbstractLogProvider } from "../../../api/providers/log/log.abstract";
import { LogEntity } from "../../../api/entities/logs/log.entity";

@Injectable({
  providedIn: 'root'
})


export class LogService {

 constructor(private provider:AbstractLogProvider ) 
 { }

  getAll(req: PagedRequest): Observable<PagedResult<LogEntity>> {
  return this.provider.getPaged(req).pipe(map((r: any) => r.data)); // ⬅️ res.data
}



}