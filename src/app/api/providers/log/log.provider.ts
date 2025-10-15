import { inject, Injectable } from "@angular/core";
import { AbstractLogProvider } from "./log.abstract";
import { API_URL } from "../api-url.token";
import { HttpClient, HttpParams } from "@angular/common/http";
import { PagedRequest, PagedResult } from "../../../core/models/common/common";
import { LogEntity } from "../../entities/logs/log.entity";
import { Observable } from "rxjs";

@Injectable()
export class LogProvider extends AbstractLogProvider {

  private readonly baseUrl = `${inject(API_URL)}/audit/logs`;

  constructor(private http: HttpClient) {
    super();
  }

  override getPaged(req: PagedRequest): Observable<PagedResult<LogEntity>> {
    let params = new HttpParams()
      .set('page', String(req.page))
      .set('size', String(req.size));

    if (req.search != null) params = params.set('search', req.search);
    if (req.sortBy != null) params = params.set('sortBy', req.sortBy);
    if (typeof req.desc === 'boolean') params = params.set('desc', String(req.desc));

    return this.http.get<PagedResult<LogEntity>>(this.baseUrl, { params });
  }

}