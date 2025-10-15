// import { Observable } from "rxjs";
// import { RoleEntity } from "../../entities/roles/role.entity";
// import { HttpClient, HttpParams } from "@angular/common/http";
// import { AbstractRoleProvider } from "./role.abstract";
// import { inject, Injectable } from "@angular/core";
// import { RoleCreateEntity } from "../../entities/roles/roleCreate.entity";
// import { RoleUpdateEntity } from "../../entities/roles/RoleUpdate.entity";

// import { PagedRequest, PagedResult } from "../../../core/models/common/common";
// import { API_URL } from "../api-url.token";


// @Injectable()
// export class RoleProvider extends AbstractRoleProvider {

//   private readonly baseUrl = `${inject(API_URL)}/roles`;

//   constructor(private http: HttpClient) {
//     super();
//   }

//   override getPaged(req: PagedRequest): Observable<PagedResult<RoleEntity>> {
//     let params = new HttpParams()
//       .set('page', String(req.page))
//       .set('size', String(req.size));

//     if (req.search != null) params = params.set('search', req.search);
//     if (req.sortBy != null) params = params.set('sortBy', req.sortBy);
//     if (typeof req.desc === 'boolean') params = params.set('desc', String(req.desc));

//     return this.http.get<PagedResult<RoleEntity>>(this.baseUrl, { params });
//   }

//   override getById(id: number): Observable<RoleEntity> {
//     return this.http.get<RoleEntity>(`${this.baseUrl}/${id}`);
//   }

//   override create(role: RoleCreateEntity): Observable<RoleEntity> {
//     return this.http.post<RoleEntity>(this.baseUrl, role);
//   }
  
//   override update(id: number, role: RoleUpdateEntity): Observable<RoleEntity> {
//     return this.http.put<RoleEntity>(`${this.baseUrl}/${id}`, role);
//   }

//   override delete(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.baseUrl}/${id}`);
//   }
// }
