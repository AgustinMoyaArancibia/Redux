import { AreaState } from "../../../api/entities/areas/areaState.entity";

export const InitialStateArea: AreaState =
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
