import { Injectable } from "@angular/core";
import { AbstractAreaProvider } from "../../../api/providers/area/area.abstract";
import { AreaEntity } from "../../../api/entities/areas/area.entity";
import { PagedResult } from "../../../modules/commont";
import { map, Observable } from "rxjs";
import { PagedRequest } from "../../models/common/common";

@Injectable({
  providedIn: 'root'
})


export class AreaService {

 constructor(private provider:AbstractAreaProvider ) 
 { }

  getAll(req: PagedRequest): Observable<PagedResult<AreaEntity>> {
  return this.provider.getPaged(req).pipe(map((r: any) => r.data)); // ⬅️ res.data
}



}