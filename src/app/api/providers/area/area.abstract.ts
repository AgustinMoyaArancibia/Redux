import { Injectable } from "@angular/core";
import { AreaEntity } from "../../entities/areas/area.entity";
import { Observable } from "rxjs";
import { PagedRequest } from "../../../core/models/common/common";
import { PagedResult } from "../../../modules/commont";

@Injectable()
export abstract class AbstractAreaProvider {
    
    //implementacion de pages
    abstract getPaged(req: PagedRequest): Observable<PagedResult<AreaEntity>>;
    


}