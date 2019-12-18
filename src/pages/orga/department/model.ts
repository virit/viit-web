import {AnyAction, Reducer} from "redux";
import {EffectsCommandMap} from "dva";
import {DeptTreeItem} from "./data";
import {deleteRecord, createNewItem, queryInfo, queryTree, update} from "./service";

export interface StateType {
  data: {
    treeData: DeptTreeItem[],
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
    fetchTree: Effect;
    queryInfo: Effect;
    delete: Effect;
    insert: Effect;
    update: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
    saveFormValues: Reducer<StateType>;
    removeById: Reducer<StateType>;
    insertOne: Reducer<StateType>;
    updateOneTreeNode: Reducer<StateType>;
    saveOrder: Reducer<StateType>;
  };
}

const initState:StateType = {
  data: {
    treeData: [],
    formValues: {
    },
  },
};

const Model:ModelType = {
  namespace: 'orgaDept',
  state: initState,
  effects: {
    *fetchTree ({ payload, callback }, {call, put}) {
      const response = yield call(queryTree);
      yield put({
        type: 'save',
        payload: response.data,
      });
      if (callback !== undefined) {
        callback();
      }
    },
    *queryInfo ({ payload, callback }, {call, put}) {
      const response = yield call(queryInfo, payload);
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
      const response = yield call(createNewItem, payload);
      const newItem: DeptTreeItem = {
        id: response.data.id,
        label: payload.name,
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
      yield call(update, payload);
      if (callback) callback();
    }
  },
  reducers: {
    save: (state, action) => {
      const newState:StateType = state === undefined ? {...initState} : {...state};
      newState.data.treeData = action.payload;
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
      const deleteFunc = (array: DeptTreeItem[]) => {
        array.map(item => {
          if (item.children === undefined) return;
          item.children = deleteFunc(item.children);
        });
        return array.filter(it => it.id !== action.payload);
      };
      newState.data.treeData = deleteFunc(newState.data.treeData);
      return newState;
    },
    insertOne: (state, action) => {
      const newState:StateType = state === undefined ? {...initState} : {...state};
      const { id, data } = action.payload;
      const saveFunc = (array: DeptTreeItem[]) => {
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
        newState.data.treeData.push(data);
      }
      else {
        saveFunc(newState.data.treeData);
      }
      return newState;
    },
    updateOneTreeNode: (state, action) => {
      const newState:StateType = state === undefined ? {...initState} : {...state};
      const { id, label } = action.payload;
      const saveFunc = (array: DeptTreeItem[]) => {
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
      saveFunc(newState.data.treeData);
      return newState;
    },
    saveOrder: (state, action) => {
      const newState:StateType = state === undefined ? {...initState} : {...state};
      const { dragNodeId, nodeId, pos, dropToGap } = action.payload;
      const menuData = newState.data.treeData;

      type ResultType = {
        node: DeptTreeItem,
        items: DeptTreeItem[],
        parent: DeptTreeItem | undefined,
      };
      const findFunction:(items: DeptTreeItem[], id: string, parent: (DeptTreeItem | undefined)) => (ResultType)
        = (items, id, parent = undefined) => {

        const afterFilter = items.filter(it => it.id === id);
        if (afterFilter.length !== 0) {
          return {
            node: afterFilter[0],
            items,
            parent: parent,
          } as ResultType;
        } else {
          for (let index in items) {
            const item = items[index];
            if (item.children && item.children.length !== 0) {
              const result = findFunction(item.children, id, item);
              if (result.node !== undefined) {
                return result;
              }
            }
          }
        }
        return {} as ResultType;
      };
      const dragNodeResult = findFunction(menuData, dragNodeId, undefined);

      const nodeResult = findFunction(menuData, nodeId, undefined);
      if (dropToGap) {
        nodeResult.items.splice(pos + 1, 0, {...dragNodeResult.node});
      } else {
        nodeResult.node.children.push({...dragNodeResult.node});
      }

      const doFilter = dragNodeResult.items.filter(it => {
        return dragNodeResult.node !== it;
      });
      if (dragNodeResult.parent !== undefined) {
        dragNodeResult.parent.children = doFilter;
      } else {
        newState.data.treeData = doFilter
      }

      return newState;
    },
  }
};
export default Model;
