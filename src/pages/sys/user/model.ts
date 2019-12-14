import {AnyAction, Reducer} from 'redux';
import {EffectsCommandMap} from 'dva';
import {addUser, queryUser, removeUser, updateUser} from './service';

import {TableListData} from './data.d';
import { query as queryRoles} from "@/pages/sys/role/service";

export interface StateType {
  data: TableListData;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    fetchRoles: Effect;
    add: Effect;
    remove: Effect;
    update: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
    setPageSize: Reducer<StateType>;
    setCurrent: Reducer<StateType>;
    setRoles: Reducer<StateType>;
    setPagination: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'sysUser',

  state: {
    data: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      roles: [],
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUser, payload);
      const { data }= response;
      yield put({
        type: 'save',
        payload: {
          data: {
            list: data.records.map((it: any) => {
              it.key = it.id;
              return it;
            }),
            pagination: {
              total: response.data.total,
            },
          },
        },
      });
    },
    *fetchRoles({ payload }, {call, put }) {
      const response = yield call(queryRoles);
      yield put({
        type: 'setRoles',
        payload: response.data.records,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addUser, payload);
      if (callback) callback(response);
    },
    *remove({ payload, callback }, { call, put }) {
      yield call(removeUser, payload);
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateUser, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    save(state: any, action) {
      const newState: any = Object.assign(state);
      newState.data.pagination = {
        ...newState.data.pagination,
        ...action.payload.data.pagination,
      };
      newState.data.list = action.payload.data.list;
      return newState;
    },
    setPageSize(state: any, action) {
      const newState: any = Object.assign(state);
      newState.data.pagination.pageSize = action.payload;
      return newState;
    },
    setPagination(state: any, action) {
      const newState: any = Object.assign(state);
      newState.data.pagination = {
        ...newState.data.pagination,
        ...action.payload,
      };
      return newState;
    },
    setCurrent(state: any, action) {
      const newState: any = Object.assign(state);
      newState.data.pagination.current = action.payload;
      return newState;
    },
    setRoles(state: any, action) {
      const newState: any = {...state};
      const { data } = newState;
      data.roles = action.payload;
      return newState;
    }
  },
};

export default Model;
