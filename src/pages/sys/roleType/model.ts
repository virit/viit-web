import {Effect} from "dva";
import {Reducer} from "redux";
import {SysRoleType} from "@/pages/sys/roleType/data";
import {deleteRoleType, newRoleType, queryRoleTypes} from "@/pages/sys/roleType/service";

export interface StateType {
  data: {
    list: SysRoleType[];
    pagination: {
      total: number;
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
  };
  reducers: {
    saveList: Reducer<StateType>
  }
}

// 初始状态
const initState:StateType = {
  data: {
    list: [],
    pagination: {
      total: 0,
    },
  },
};

const Model: ModelType = {
  namespace: 'sysRoleType',
  state: initState,
  effects: {
    *fetch({ payload, callback }, { call, put}) {
      const response = yield call(queryRoleTypes, payload);
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
      yield call(newRoleType, payload);
      if (callback) callback();
    },
    *delete({ payload, query, callback, fetchCallback}, { call, put }) {
      yield call(deleteRoleType, payload);
      if (callback) callback();
      yield put({
        type: 'fetch',
        payload: query,
        callback: fetchCallback
      });
    }
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
    }
  }
};
export default Model;
