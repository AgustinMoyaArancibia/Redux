import { SystemProjectEntity } from "../../api/entities/systemProjects/systemProject.entity";
import { SystemProjectCreateEntity } from "../../api/entities/systemProjects/systemProjectCreate.entity";
import { SystemProjectUpdateEntity } from "../../api/entities/systemProjects/systemProjectUpdate.entity";
import { Mapper } from "../base/mapper";
import { SystemProjectModel } from "../models/systemProjects/systemProject.model";

export class SystemProjectMapper extends Mapper<SystemProjectEntity, SystemProjectModel> {
  override mapFrom(entity: SystemProjectEntity): SystemProjectModel {
    return {
      id: entity.id,
      name: entity.name,
      sectorId: entity.sectorId,
      sector: entity.sector,
      devEnvId: entity.devEnvId,
      devEnvironment: entity.devEnvironment
    };
  }

  override mapTo(model: SystemProjectModel): SystemProjectEntity {
    return {
      id: model.id,
      name: model.name,
      sectorId: model.sectorId,
      sector: model.sector,
      devEnvId: model.devEnvId,
      devEnvironment: model.devEnvironment
    };
  }

  toCreateRequest(model: SystemProjectModel): SystemProjectCreateEntity {
    return {
      name: model.name,
      sectorId: model.sectorId,
      devEnvId: model.devEnvId
    };
  }

  toUpdateRequest(model: SystemProjectModel): SystemProjectUpdateEntity {
    return {
      name: model.name,
      sectorId: model.sectorId,
      devEnvId: model.devEnvId
    };
  }
}