import { DataItemEntity } from "../../../api/entities/dataItems/dataItem.entity";

export interface SystemInfoModel {
  id: number;
  idSystem: number;
  description?: string | null;
  urlImage?: string | null;
  language?: string | null;
  objective?: string | null;
  releaseDate?: string | null;
  systemName: string;
  sectorId: number;
  sector?: string | null;
  gerenciaId?: number | null;   // 👈 NUEVO
  gerencia?: string | null;     // 👈 NUEVO
  devEnvId: number;
  devEnvironment: string;
  dataItems: DataItemEntity[];
}
