// // import { RoleEntity } from "../../api/entities/roles/role.entity";
// // import { RoleCreateEntity } from "../../api/entities/roles/roleCreate.entity";
// import { Mapper } from "../base/mapper";
// import { RoleModel } from "../models/roleModel/role.model";


// export class RoleMapper extends Mapper<RoleEntity, RoleModel> {


//     override mapFrom(entity: RoleEntity): RoleModel {
//         return {
//             id: entity.id,
//             description: entity.description


//         };
//     }


//     override mapTo(entity: RoleModel): RoleEntity {
//         return {
//             id: entity.id,
//             description: entity.description
//         };

//     }


//     toCreateRequest(model: RoleModel): RoleCreateEntity {
//         return {
//             description: model.description
//         };
//     }

//     toUpdateRequest(model: RoleModel): RoleEntity {
//         return {
//             id: model.id,
//             description: model.description
//         };
//     }


// }



