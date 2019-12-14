import {AnyAction, Reducer} from "redux";
import {EffectsCommandMap} from "dva";
import {MenuTreeItem} from "@/pages/sys/menu/data";
import {deleteRecord, newMenu, queryMenuInfo, queryTreeMenus, updateMenu} from "@/pages/sys/menu/service";

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
    delete: Effect;
    insert: Effect;
    update: Effect;
  };
  reducers: {
    saveMenus: Reducer<StateType>;
    saveFormValues: Reducer<StateType>;
    removeById: Reducer<StateType>;
    insertOne: Reducer<StateType>;
    updateOneTreeNode: Reducer<StateType>;
  };
}

const initState:StateType = {
  data: {
    menuData: [],
    formValues: {
      type: 10
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
    },
    *delete({ payload, callback }, {call, put}) {
      yield call(deleteRecord, payload);
      yield put({
        type: 'removeById',
        payload,
      });
      if (callback) callback();
    },
    *insert({ payload, callback }, {call, put}) {
      const response = yield call(newMenu, payload);
      const newItem: MenuTreeItem = {
        id: response.data.id,
        label: payload.title,
        children: [],
      };
      yield put({
        type: 'insertOne',
        payload: {
          id: payload.parentId,
          data: newItem,
        },
      });
      if (callback) callback(response.data.id);
    },
    *update({ payload, callback }, {call, put}) {
      yield call(updateMenu, payload);
      if (callback) callback();
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
      newState.data.formValues = {
        ...action.payload,
      };
      return newState;
    },
    removeById: (state, action) => {
      const newState:StateType = state === undefined ? {...initState} : {...state};
      const deleteFunc = (array: MenuTreeItem[]) => {
        array.map(item => {
          if (item.children === undefined) return;
          item.children = deleteFunc(item.children);
        });
        return array.filter(it => it.id !== action.payload);
      };
      newState.data.menuData = deleteFunc(newState.data.menuData);
      return newState;
    },
    insertOne: (state, action) => {
      const newState:StateType = state === undefined ? {...initState} : {...state};
      const { id, data } = action.payload;
      const saveFunc = (array: MenuTreeItem[]) => {
        array.forEach(item => {
          if (item.id === id) {
            item.children.push(data);
            return;
          }
          if (item.children && item.children.length !== 0) {
            saveFunc(item.children);
          }
        });
      };
      if (id === undefined) {
        newState.data.menuData.push(data);
      }
      else {
        saveFunc(newState.data.menuData);
      }
      return newState;
    },
    updateOneTreeNode: (state, action) => {
      const newState:StateType = state === undefined ? {...initState} : {...state};
      const { id, label } = action.payload;
      const saveFunc = (array: MenuTreeItem[]) => {
        array.forEach(item => {
          if (item.id === id) {
            item.label = label;
            return;
          }
          if (item.children && item.children.length !== 0) {
            saveFunc(item.children);
          }
        });
      };
      saveFunc(newState.data.menuData);
      return newState;
    },
  }
};
export default Model;
