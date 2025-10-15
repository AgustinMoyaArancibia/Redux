import { RoleState } from "../../../api/entities/roles/roleState.entity";

export const InitialStateRole: RoleState =
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
