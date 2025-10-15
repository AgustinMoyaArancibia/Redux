import { SystemProjectState } from "../../../api/entities/systemProjects/systemProjectState.entity";

export const InitialStateSystemProject: SystemProjectState = {
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