import { SectorEntity } from "../../api/entities/sachSectors/SectorEntity";


type SectorDto = { id: number; description: string } | { Id: number; description: string };

export function mapSectorDtoToEntity(d: SectorDto): SectorEntity {
  const id = (d as any).id ?? (d as any).Id;
  const description = (d as any).descripcion ?? (d as any).Descripcion ?? "";
  return { id, description };
}
