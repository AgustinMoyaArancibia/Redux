// import { inject, Injectable } from "@angular/core";
// import { AbstractDevEnvironmentProvider } from "./devEnvironment.abstract";
// import { Observable } from "rxjs";
// import { PagedRequest } from "../../../core/models/common/common";
// import { PagedResult } from "../../../modules/commont";
// import { DevEnvironmentEntity } from "../../entities/devEnvironments/devEnvironment.entity";
// import { HttpClient, HttpParams } from "@angular/common/http";
// import { API_URL } from "../api-url.token";

// @Injectable()
// export class DevEnvironmentProvider extends AbstractDevEnvironmentProvider {

//     private readonly baseUrl = `${inject(API_URL)}/devEnvironments`;

//     constructor(private http: HttpClient) {
//         super();
//     }

//     override getPaged(req: PagedRequest): Observable<PagedResult<DevEnvironmentEntity>> {
//         let params = new HttpParams()
//             .set('page', String(req.page))
//             .set('size', String(req.size));

//         if (req.search != null) params = params.set('search', req.search);
//         if (req.sortBy != null) params = params.set('sortBy', req.sortBy);
//         if (typeof req.desc === 'boolean') params = params.set('desc', String(req.desc));

//         return this.http.get<PagedResult<DevEnvironmentEntity>>(this.baseUrl, { params });
//     }


// }