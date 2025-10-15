import { SystemProjectEntity } from "./systemProject.entity";

export interface SystemProjectState {
  items: SystemProjectEntity[];
  total: number;
  page: number;
  size: number;
  search?: string | null;
  sortBy?: string | null;
  desc: boolean;
  selectedId: number | null;
  loading: boolean;
  error: string | null;
}
