import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { map, Observable } from "rxjs";
import { PagedRequest } from "../../../core/models/common/common";
import { PagedResult } from "../../../modules/commont";
import { SystemProjectEntity } from "../../entities/systemProjects/systemProject.entity";
import { API_URL } from "../api-url.token";
import { AbstractDataItemProvider } from "./dataItem.abstract";
import { DataItemEntity } from "../../entities/dataItems/dataItem.entity";


@Injectable()
export class DataItemProvider extends AbstractDataItemProvider {

  private readonly baseUrl = `${inject(API_URL)}/dataItems`;

  constructor(private http: HttpClient) {
    super();
  }

override getPaged(req: PagedRequest): Observable<PagedResult<DataItemEntity>> {
  let params = new HttpParams()
    .set('page', String(req.page))
    .set('size', String(req.size));

  if (req.search != null) params = params.set('search', req.search);
  if (req.sortBy != null) params = params.set('sortBy', req.sortBy);
  if (typeof req.desc === 'boolean') params = params.set('desc', String(req.desc));

  // ⬇️ OJO: el backend devuelve ServiceResult<PagedResult<...>>
  return this.http
    .get<{ data: PagedResult<DataItemEntity> }>(this.baseUrl, { params })
    .pipe(
      map(r => r.data ?? { items: [], total: 0, page: req.page, size: req.size, totalPages: 0 })
    );
}

override getById(id: number): Observable<DataItemEntity> {
  return this.http
    .get<{ data: DataItemEntity }>(`${this.baseUrl}/${id}`)
    .pipe(map(r => r.data));
}
}