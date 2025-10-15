import { SystemInfoState } from "../../../api/entities/systemInfos/systemInfoState.entity";

export const InitialStateSystemInfo: SystemInfoState = {
  items: [],
  total: 0,
  page: 1,
  size: 20,
  search: null,
  sortBy: null,
  desc: false,
  selectedId: null,
  loading: false,
  error: null,
    saving: false,     // ⬅️
  deleting: false,   // ⬅️
  env: null,    
};