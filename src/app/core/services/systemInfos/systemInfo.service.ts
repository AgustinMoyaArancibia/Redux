import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PagedRequest, PagedResult } from "../../models/common/common";
import { AbstractSystemInfoProvider } from "../../../api/providers/systemInfos/systemInfo.abstract";
import { SystemInfoEntity } from "../../../api/entities/systemInfos/systemInfo.entity";
import { SystemInfoUpsertEntity } from "../../../api/entities/systemInfos/systemInfoUpsert.entity";

@Injectable({ providedIn: 'root' })
export class SystemInfoService {
  constructor(private provider: AbstractSystemInfoProvider) { }

  getAll(req: PagedRequest): Observable<PagedResult<SystemInfoEntity>> {
    return this.provider.getPaged(req);
  }
  getById(id: number): Observable<SystemInfoEntity> {
    return this.provider.getById(id);
  }
  getBySystemId(idSystem: number): Observable<SystemInfoEntity | null> {
    return this.provider.getBySystemId(idSystem);
  }
update(id: number, body: SystemInfoUpsertEntity, file?: File | null) {
  return this.provider.update(id, body, file ?? null);
}

  updateBySystemId(idSystem: number, body: SystemInfoUpsertEntity): Observable<SystemInfoEntity> {
    return this.provider.updateBySystemId(idSystem, body);
  }
  create(body: SystemInfoUpsertEntity, file?: File | null) {
    return this.provider.create(body, file ?? null);
  }
  // upsert(body: SystemInfoUpsertEntity): Observable<SystemInfoEntity> {
  //   return this.provider.upsert(body);
  // }
  deleteItem(systemInfoId: number, idItem: number): Observable<void> {
    return this.provider.deleteItem(systemInfoId, idItem);
  }

 getByEnvironment(env: string, opts: { page: number; size: number; search?: string | null; sortBy?: string | null; desc?: boolean }) {
  return this.provider.getByEnvironment(env, opts);
}



}
