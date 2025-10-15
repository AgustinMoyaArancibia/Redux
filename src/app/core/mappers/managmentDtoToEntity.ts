import { ManagmentEntity } from "../../api/entities/sachManagements/managment.Entity";



type ManagmentDto = { id: number; description: string } | { Id: number; description: string };

export function mapManagmentDtoToEntity(d: ManagmentDto): ManagmentEntity {
  const id = (d as any).id ?? (d as any).Id;
  const description = (d as any).descripcion ?? (d as any).Descripcion ?? "";
  return { id, description };
}
