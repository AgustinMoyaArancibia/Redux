import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { map, Observable } from "rxjs";
import { PagedRequest } from "../../../core/models/common/common";
import { PagedResult } from "../../../modules/commont";
import { SystemProjectEntity } from "../../entities/systemProjects/systemProject.entity";
import { API_URL } from "../api-url.token";
import { AbstractSystemProjectProvider } from "./systemProject.abstract";
type ApiEnvelope<T> = {
  succeeded: boolean;
  code: number;
  message: string | null;
  errors: any[];
  data: T;
};
@Injectable()
export class SystemProjectProvider extends AbstractSystemProjectProvider {

  private readonly baseUrl = `${inject(API_URL)}/systemProjects`;

  constructor(private http: HttpClient) {
    super();
  }

  override getPaged(req: PagedRequest): Observable<PagedResult<SystemProjectEntity>> {
    let params = new HttpParams()
      .set('page', String(req.page))
      .set('size', String(req.size));

    if (req.search != null) params = params.set('search', req.search);
    if (req.sortBy != null) params = params.set('sortBy', req.sortBy);
    if (typeof req.desc === 'boolean') params = params.set('desc', String(req.desc));

    return this.http.get<PagedResult<SystemProjectEntity>>(this.baseUrl, { params });
  }

  override getById(id: number): Observable<SystemProjectEntity> {
    return this.http.get<SystemProjectEntity>(`${this.baseUrl}/${id}`);
  }

    override getUnlinkedAll(): Observable<SystemProjectEntity[]> {
  return this.http
    .get<ApiEnvelope<SystemProjectEntity[]>>(`${this.baseUrl}/unlinked/all`)
    .pipe(map(res => res?.data ?? []));
  }
}