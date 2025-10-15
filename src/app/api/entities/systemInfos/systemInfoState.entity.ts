import { SystemInfoEntity } from "./systemInfo.entity";

export interface SystemInfoState {
  items: SystemInfoEntity[];
  total: number;
  page: number;
  size: number;
  search?: string | null;
  sortBy?: string | null;
  desc: boolean;
  selectedId: number | null;
  loading: boolean;
  error: string | null;
   
  saving: boolean;    // ⬅️ para create/update (PUT/POST)
  deleting: boolean;  // ⬅️ para delete
   env?: string | null; 

}
