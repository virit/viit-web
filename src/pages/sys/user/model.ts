import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addUser, queryRule, removeUser, updateRule } from './service';

import { TableListData, TablePageQuery } from './data.d';

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
    add: Effect;
    remove: Effect;
    update: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
    setPageSize: Reducer<StateType>;
    setCurrent: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'sysUser',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
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
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addUser, payload);
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
      const response = yield call(removeUser, payload);
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload.data,
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
  },
};

export default Model;
