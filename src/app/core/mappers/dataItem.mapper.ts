import { DataItemEntity } from "../../api/entities/dataItems/dataItem.entity";

import { Mapper } from "../base/mapper";
import { DataItemModel } from "../models/dataItem/dataItem.model";
import { RoleModel } from "../models/roleModel/role.model";


export class DataItemMapper extends Mapper<DataItemEntity, DataItemModel> {


    override mapFrom(entity: DataItemEntity): DataItemModel {
        return {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            sectorId: entity.sectorId

        };
    }


    override mapTo(entity: DataItemModel): DataItemEntity {
        return {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            sectorId: entity.sectorId
        };

    }




}



