import { LogState } from "../../../api/entities/logs/logState.entity";

export const InitialStateLog: LogState =
{
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
};
