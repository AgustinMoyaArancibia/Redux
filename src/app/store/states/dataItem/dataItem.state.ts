import { DataItemState } from "../../../api/entities/dataItems/dataItemState.entity";

export const InitialStateDataItem: DataItemState = {
  items: [],
  total: 0,
  page: 1,
  size: 20,
  search: null,
  sortBy: null,
  desc: false,
  selectedId: null,
  loading: false,
  error: null
};