import { inject, Injectable } from "@angular/core";
import { API_URL } from "../api-url.token";
import { AbstractAreaProvider } from "./area.abstract";
import { HttpClient, HttpParams } from "@angular/common/http";
import { PagedRequest, PagedResult } from "../../../core/models/common/common";
import { Observable } from "rxjs";
import { AreaEntity } from "../../entities/areas/area.entity";

@Injectable()
export class AreaProvider extends AbstractAreaProvider {

  private readonly baseUrl = `${inject(API_URL)}/areas`;

  constructor(private http: HttpClient) {
    super();
  }

  override getPaged(req: PagedRequest): Observable<PagedResult<AreaEntity>> {
    let params = new HttpParams()
      .set('page', String(req.page))
      .set('size', String(req.size));

    if (req.search != null) params = params.set('search', req.search);
    if (req.sortBy != null) params = params.set('sortBy', req.sortBy);
    if (typeof req.desc === 'boolean') params = params.set('desc', String(req.desc));

    return this.http.get<PagedResult<AreaEntity>>(this.baseUrl, { params });
  }

}