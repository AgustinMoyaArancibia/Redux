// import { Injectable } from "@angular/core";

// import { RoleEntity } from "../../../api/entities/roles/role.entity";
// import { Observable } from "rxjs";
// import { RoleCreateEntity } from "../../../api/entities/roles/roleCreate.entity";
// import { RoleUpdateEntity } from "../../../api/entities/roles/RoleUpdate.entity";
// import { PagedRequest, PagedResult } from "../../models/common/common";
// import { AbstractRoleProvider } from "../../../api/providers/role/role.abstract";

// @Injectable({
//   providedIn: 'root'
// })
// export class RoleService {

//  constructor(private provider:AbstractRoleProvider ) 
//  { }

//   getAll(req: PagedRequest): Observable<PagedResult<RoleEntity>> {
//     return this.provider.getPaged(req);
//   }

//   getById(id: number): Observable<RoleEntity> {
//     return this.provider.getById(id);
//   }

//    update(id: number, changes: RoleUpdateEntity): Observable<RoleEntity> {
//     return this.provider.update(id, changes);
//   }

//   create(rol: RoleCreateEntity): Observable<RoleEntity> {
//     return this.provider.create(rol);
//   }

//   delete(id: number): Observable<void> {
//     return this.provider.delete(id);
//   }



// }