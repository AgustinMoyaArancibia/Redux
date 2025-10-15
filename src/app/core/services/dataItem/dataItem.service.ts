import { Injectable } from "@angular/core";
import { AbstractDataItemProvider } from "../../../api/providers/dataItems/dataItem.abstract";
import { DataItemEntity } from "../../../api/entities/dataItems/dataItem.entity";
import { PagedRequest, PagedResult } from "../../models/common/common";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class DataItemService {
  constructor(private provider: AbstractDataItemProvider) {}

  getAll(req: PagedRequest): Observable<PagedResult<DataItemEntity>> {
    return this.provider.getPaged(req);
  }

  getById(id: number): Observable<DataItemEntity> {
    return this.provider.getById(id);
  }
}