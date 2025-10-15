import { Injectable } from "@angular/core";
import { LogEntity } from "../../entities/logs/log.entity";
import { PagedRequest, PagedResult } from "../../../core/models/common/common";
import { Observable } from "rxjs";

@Injectable()
export abstract class AbstractLogProvider {
    
    //implementacion de pages
    abstract getPaged(req: PagedRequest): Observable<PagedResult<LogEntity>>;
    


}