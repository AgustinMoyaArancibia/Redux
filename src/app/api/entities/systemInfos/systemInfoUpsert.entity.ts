export interface SystemInfoUpsertEntity {
  id:number;
   idSystem: number;
  description?: string | null;
  urlImage?: string | null;
  language?: string | null;
  objective?: string | null;
  releaseDate?: string | null; // ISO
   gerenciaId?: number | null;
}
