import {Effect} from "dva";
import {Reducer} from "redux";
import {StateType} from "@/pages/sys/role/model";

export interface HttpResponse {
  code: number;
  msg: string;
  data: any;
}

export interface BaseModelType<T> {
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
    saveList: Reducer<T>;
    saveOneItem: Reducer<T>;
  }
}
