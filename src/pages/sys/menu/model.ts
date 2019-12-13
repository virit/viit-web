import {AnyAction, Reducer} from "redux";
import {EffectsCommandMap} from "dva";
import {MenuTreeItem} from "@/pages/sys/menu/data";
import {queryMenuInfo, queryTreeMenus} from "@/pages/sys/menu/service";

export interface StateType {
  data: {
    menuData: MenuTreeItem[],
    formValues: any,
  }
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetchMenus: Effect;
    queryMenuInfo: Effect;
  };
  reducers: {
    saveMenus: Reducer<StateType>;
    saveFormValues: Reducer<StateType>;
  };
}

const initState:StateType = {
  data: {
    menuData: [],
    formValues: {
    }
  }
};

const Model:ModelType = {
  namespace: 'sysMenu',
  state: initState,
  effects: {
    *fetchMenus ({ payload, callback }, {call, put}) {
      const response = yield call(queryTreeMenus);
      yield put({
        type: 'saveMenus',
        payload: response.data,
      });
      if (callback !== undefined) {
        callback();
      }
    },
    *queryMenuInfo ({ payload, callback }, {call, put}) {
      const response = yield call(queryMenuInfo, payload);
      yield put({
        type: 'saveFormValues',
        payload: {...response.data},
      });
      if (callback !== undefined) {
        callback();
      }
    }
  },
  reducers: {
    saveMenus: (state, action) => {
      const newState:StateType = state === undefined ? {...initState} : {...state};
      newState.data.menuData = action.payload;
      return newState;
    },
    saveFormValues: (state, action) => {
      const newState:StateType = state === undefined ? {...initState} : {...state};
      newState.data.formValues = action.payload;
      return newState;
    },
  }
};
export default Model;
