import { DataItemEntity } from "../dataItems/dataItem.entity";

export interface SystemInfoEntity {
  // ===== Propios =====
  id: number;
  idSystem: number;
  description?: string | null;
  urlImage?: string | null;
  language?: string | null;
  objective?: string | null;
  releaseDate?: string | null; // ISO string en FE

  // ===== Gerencias (nuevo) =====
  gerenciaIds?: number[];     // <- lista de IDs
  gerencias?: string[];       // <- nombres para mostrar

  // (compat temporal)
  gerenciaId?: number | null;
  gerencia?: string | null;

  // ===== Externos de SystemProjects =====
  systemName: string;
  sectorId: number;
  sector?: string | null;
  devEnvId: number;
  devEnvironment: string;

sectorIds?: number[];
  sectors?: string[];
  
  // ===== DataItems =====
  dataItems: DataItemEntity[];
}
