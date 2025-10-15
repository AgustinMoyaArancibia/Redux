import { LogEntity } from "./log.entity";

export interface LogState {
    items: LogEntity[];
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