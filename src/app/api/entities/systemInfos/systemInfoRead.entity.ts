import { DataItemEntity } from "../dataItems/dataItem.entity";

export interface SystemInfoReadEntity {
  // ====== Propios ======
  id: number;
  idSystem: number;
  description?: string | null;
  urlImage?: string | null;
  language?: string | null;
  objective?: string | null;
  releaseDate?: string | null; // ISO (ej. '2025-09-26T00:00:00Z')

  // ====== Gerencias ======
  gerenciaIds?: number[];   // ✅ ahora el backend devuelve lista de IDs
  gerencias?: string[];     // ✅ nombres de todas las gerencias

  // (Compatibilidad temporal con versión vieja)
  gerenciaId?: number;
  gerencia?: string;

  // ====== Externos (SystemProjects) ======
  systemName: string;
  sectorId: number;
  sector?: string | null;
  devEnvId: number;
  devEnvironment: string;

  // ====== Relación 1:N con DataItems ======
  dataItems: DataItemEntity[];
}
