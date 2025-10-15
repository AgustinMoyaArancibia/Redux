import { Observable } from "rxjs";
import { PagedRequest, PagedResult } from "../../../core/models/common/common";
import { Injectable } from "@angular/core";
import { DataItemEntity } from "../../entities/dataItems/dataItem.entity";

@Injectable()
export abstract class AbstractDataItemProvider {
    
    //implementacion de pages
    abstract getPaged(req: PagedRequest): Observable<PagedResult<DataItemEntity>>;
    abstract getById(id: number): Observable<DataItemEntity>;




}