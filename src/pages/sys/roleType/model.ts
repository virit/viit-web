import {AnyAction, Reducer} from 'redux';
import {EffectsCommandMap} from 'dva';
import {addRule, queryDictType, removeRule, updateRule} from './service';

import {TableListData} from './data.d';

export interface StateType {
  data: TableListData
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
    saveList: Reducer<StateType>;
    savePage: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'sysRoleType',

  state: {
    data: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 10
      },
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryDictType, payload);
      yield put({
        type: 'saveList',
        payload: response.data.records,
      });
      yield put({
        type: 'savePage',
        payload: response.data.total,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
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
      const { payload } = action;
      return {
        data: {
          ...state,
          ...payload,
        },
      };
    },
    saveList(state, action) {
      const { payload } = action;
      return {
        // @ts-ignore
        data: Object.assign({}, state.data, {list: payload})
      };
    },
    savePage(state, action) {
      const { payload } = action;
      // @ts-ignore
      const page = Object.assign({}, state.pagination, payload);
      return Object.assign({}, state, { pagination: page });
    }
  },
};

export default Model;
