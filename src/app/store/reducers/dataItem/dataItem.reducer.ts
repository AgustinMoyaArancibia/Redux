import { createReducer, on } from "@ngrx/store";

import { InitialStateDataItem } from "../../states/dataItem/dataItem.state";
import { loadDataItem, loadDataItemFail, loadDataItemSuccess, resetDataItem, selectDataItem, setDataItem, setDataItemById, setDataItemByIdError, setDataItemError, setDataItemLoading } from "../../actions/dataItem/dataItem.action";

export const DataItemReducer = createReducer(
    InitialStateDataItem,

    // load (lista)
    on(loadDataItem, (state, { page, size, search = null, sortBy = null, desc = false }) => ({
        ...state, page, size, search, sortBy, desc, loading: true, error: null
    })),
    on(loadDataItemSuccess, (state, { items, total, page, size }) => ({
        ...state, items, total, page, size, loading: false, error: null
    })),
    on(loadDataItemFail, (state, { error }) => ({ ...state, loading: false, error })),

    // set by id
    on(setDataItemById, (state, { project }) => ({
        ...state,
        items: [
            ...state.items.filter(p => p.id !== project.id),
            project
        ],
        selectedId: project.id,
        error: null
    })),
    on(setDataItemByIdError, (state, { error }) => ({ ...state, error })),


    // ui flags
    on(setDataItemLoading, (state, { loading }) => ({
        ...state, loading, error: loading ? null : state.error
    })),
    on(setDataItem, (state, { items }) => ({ ...state, items, error: null })),
    on(selectDataItem, (state, { selectedId }) => ({ ...state, selectedId })),
    on(setDataItemError, (state, { error }) => ({ ...state, error })),

    // reset
    on(resetDataItem, () => InitialStateDataItem),
);
