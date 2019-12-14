import { Effect } from "dva";
import { Reducer } from "redux";
import {
  query,
  newRecord,
  deleteRecords,
  get,
  update
} from "./service";
import { SysRole } from "./data";
import {queryRoleTypes} from "@/pages/sys/roleType/service";
import {SysRoleType} from "@/pages/sys/roleType/data";
import {queryTreeMenus} from "@/pages/sys/menu/service";

export interface StateType {
  data: {
    list: SysRole[];
    pagination: {
      total: number;
    },
    roleTypes: SysRoleType[] | undefined;
    menuTree: any,
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
    fetchRoleTypes: Effect;
    fetchMenuTree: Effect;
  };
  reducers: {
    saveList: Reducer<StateType>;
    saveOneItem: Reducer<StateType>;
    saveRoleTypes: Reducer<StateType>;
    saveMenuTree: Reducer<StateType>;
  }
}

// 初始状态
const initState:StateType = {
  data: {
    list: [],
    pagination: {
      total: 0,
    },
    roleTypes: undefined,
    menuTree: undefined,
  },
};

const Model: ModelType = {
  namespace: 'sysRole',
  state: initState,
  effects: {
    *fetch({ payload, callback }, { call, put}) {
      const response = yield call(query, payload);
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
      yield call(newRecord, payload);
      if (callback) callback();
    },
    *delete({ payload, query, callback, fetchCallback}, { call, put }) {
      yield call(deleteRecords, payload);
      if (callback) callback();
      yield put({
        type: 'fetch',
        payload: query,
        callback: fetchCallback
      });
    },
    *get({ payload, callback}, { call }) {
      const response = yield call(get, payload);
      if (callback) callback(response);
    },
    *update({ payload, callback, queryCallback}, { call, put }) {
      const response = yield call(update, payload);
      if (callback) callback(response);
      const queryResponse = yield call(get, payload.id);
      yield put({
        type: 'saveOneItem',
        payload: queryResponse.data,
      });
      if (queryCallback) queryCallback();
    },
    *fetchRoleTypes(_, { call, put }) {
      const response = yield call(queryRoleTypes);
      yield put({
        type: 'saveRoleTypes',
        payload: response.data.records,
      });
    },
    *fetchMenuTree(_, { call, put }) {
      const response = yield call(queryTreeMenus);
      yield put({
        type: 'saveMenuTree',
        payload: response.data,
      });
    },
  },
  reducers: {
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
    },
    saveRoleTypes(state, { payload }) {
      if (state === undefined) {
        return {...initState};
      }
      const newState = {...state};
      newState.data.roleTypes = payload;
      return newState;
    },
    saveMenuTree(state, { payload }) {
      if (state === undefined) {
        return {...initState};
      }
      const newState = {...state};
      newState.data.menuTree = payload;
      return newState;
    },
  }
};
export default Model;
