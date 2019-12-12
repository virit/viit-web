import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addUser, queryUser, removeUser, updateUser } from './service';

import { TableListData, TablePageQuery } from './data.d';
import {queryRoles} from "@/pages/sys/role/service";

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
  };
}

const Model: ModelType = {
  namespace: 'sysUser',

  state: {
    data: {
      list: [],
      pagination: {},
      roles: [],
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryUser, payload);
      yield put({
        type: 'save',
        payload: {
          data: {
            list: response.data.records.map((it: any) => {
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
      yield call(addUser, payload);
      const query: TablePageQuery = {
        page: {
          size: 10,
          current: 1,
        },
        fields: {},
      };
      yield put({
        type: 'fetch',
        payload: query,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      yield call(removeUser, payload);
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateUser, payload);
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {
          // @ts-ignore
          ...state.data,
          ...action.payload.data,
        },
      };
    },
    setPageSize(state: any, action) {
      const newState: any = Object.assign(state);
      newState.data.pagination.pageSize = action.payload;
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
