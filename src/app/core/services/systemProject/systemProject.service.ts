import { Observable } from "rxjs";
import { SystemProjectEntity } from "../../../api/entities/systemProjects/systemProject.entity";
import { PagedRequest, PagedResult } from "../../models/common/common";
import { Injectable } from "@angular/core";
import { AbstractSystemProjectProvider } from "../../../api/providers/systemProject/systemProject.abstract";

@Injectable({ providedIn: 'root' })
export class SystemProjectService {
  constructor(private provider: AbstractSystemProjectProvider) {}

  getAll(req: PagedRequest): Observable<PagedResult<SystemProjectEntity>> {
    return this.provider.getPaged(req);
  }

  getById(id: number): Observable<SystemProjectEntity> {
    return this.provider.getById(id);
  }

    getUnlinkedAll() {
    return this.provider.getUnlinkedAll();
  }
}