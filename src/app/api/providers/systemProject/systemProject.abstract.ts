import { Observable } from "rxjs";
import { SystemProjectEntity } from "../../entities/systemProjects/systemProject.entity";
import { PagedResult } from "../../../modules/commont";
import { PagedRequest } from "../../../core/models/common/common";
import { Injectable } from "@angular/core";

@Injectable()
export abstract class AbstractSystemProjectProvider {
    
    //implementacion de pages
    abstract getPaged(req: PagedRequest): Observable<PagedResult<SystemProjectEntity>>;
    abstract getById(id: number): Observable<SystemProjectEntity>;

abstract getUnlinkedAll(): Observable<SystemProjectEntity[]>;


}