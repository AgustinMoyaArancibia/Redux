import { DataItemEntity } from "./dataItem.entity";

export interface DataItemState {
   items: DataItemEntity[];
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