// src/app/store/reducers/sectors/sector.state.ts
import { SectorEntity } from "../../../api/entities/sachSectors/SectorEntity";

export interface ManagmentState {
  items: SectorEntity[];
  loading: boolean;
  error: string | null;

}

export const initialManagmentState: ManagmentState = {
  items: [],
  loading: false,
  error: null,
  
};
