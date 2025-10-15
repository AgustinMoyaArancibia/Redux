// src/app/store/reducers/sectors/sector.state.ts
import { SectorEntity } from "../../../api/entities/sachSectors/SectorEntity";

export interface SectorState {
  items: SectorEntity[];
  loading: boolean;
  error: string | null;
  idGerencia: number | null; // último filtro utilizado
}

export const initialSectorState: SectorState = {
  items: [],
  loading: false,
  error: null,
  idGerencia: null
};
