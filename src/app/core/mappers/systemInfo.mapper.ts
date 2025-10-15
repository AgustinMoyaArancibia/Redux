import { SystemInfoEntity } from "../../api/entities/systemInfos/systemInfo.entity";
import { SystemInfoUpsertEntity } from "../../api/entities/systemInfos/systemInfoUpsert.entity";
import { Mapper } from "../base/mapper";
import { SystemInfoModel } from "../models/systemInfos/systemInfo.model";


export class SystemInfoMapper extends Mapper<SystemInfoEntity, SystemInfoModel> {
  override mapFrom(e: SystemInfoEntity): SystemInfoModel {
    return { ...e };
  }
  override mapTo(m: SystemInfoModel): SystemInfoEntity {
    return { ...m };
  }
}
