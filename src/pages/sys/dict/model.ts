import {Effect} from "dva";
import {Reducer} from "redux";
import {SysDict} from "./data";
import {
  deleteDict,
  getDictById,
  newDict,
  queryDicts,
  updateDict
} from "./service";

export interface StateType {
  data: {
    list: SysDict[];
    pagination: {
      total: number;
      current: number;
      pageSize: number;
    }
  }
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    insert: Effect;
    delete: Effect;
    get: Effect;
    update: Effect;
  };
  reducers: {
    saveList: Reducer<StateType>;
    saveOneItem: Reducer<StateType>;
    setPagination: Reducer<StateType>;
  }
}

// 初始状态
const initState:StateType = {
  data: {
    list: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 10,
    },
  },
};

const Model: ModelType = {
  namespace: 'sysDict',
  state: initState,
  effects: {
    *fetch({ payload, callback }, { call, put}) {
      const response = yield call(queryDicts, payload);
      const { data: { records, total }} = response;
      yield put({
        type: 'saveList',
        payload: {
          list: records,
          total,
        },
      });
      if (callback) callback();
    },
    *insert({ payload, callback}, { call }) {
      yield call(newDict, payload);
      if (callback) callback();
    },
    *delete({ payload, query, callback, fetchCallback}, { call, put }) {
      yield call(deleteDict, payload);
      if (callback) callback();
      yield put({
        type: 'fetch',
        payload: query,
        callback: fetchCallback
      });
    },
    *get({ payload, callback}, { call }) {
      const response = yield call(getDictById, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback, queryCallback}, { call, put }) {
      const response = yield call(updateDict, payload);
      if (callback) callback(response);
      const queryResponse = yield call(getDictById, payload.id);
      yield put({
        type: 'saveOneItem',
        payload: queryResponse.data,
      });
      if (queryCallback) queryCallback();
    }
  },
  reducers: {
    setPagination(state, { payload }) {
      if (state === undefined) {
        return {...initState};
      }
      const newState = {...state};
      newState.data.pagination = {
        ...newState.data.pagination,
        ...payload,
      };
      return newState;
    },
    saveList(state, { payload }) {
      if (state === undefined) {
        return {...initState};
      }
      const newState = {...state};
      newState.data.list = payload.list;
      newState.data.pagination.total = payload.total;
      return newState;
    },
    saveOneItem(state, { payload }) {
      if (state === undefined) {
        return {...initState};
      }
      const newState = {...state};
      newState.data.list = newState.data.list.map(it => {
        if (it.id === payload.id) {
          return payload;
        } else {
          return it;
        }
      });
      return newState;
    }
  }
};
export default Model;
