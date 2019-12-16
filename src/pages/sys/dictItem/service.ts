import {PageQuery, toQueryParams} from "@/utils/pages";
import request from "@/utils/request";
import {SysDictItemForm} from "./data";

const resourceName = '/sys/dict-item';

export async function queryDictItems(params: PageQuery) {
  return request(resourceName, {
    params: toQueryParams(params)
  });
}

export async function newDictItem(params: SysDictItemForm) {
  return request(resourceName, {
    method: 'post',
    data: params,
  });
}

export async function deleteDictItem(params: string) {
  return request(`${resourceName}/${params}`, {
    method: 'delete'
  });
}

export async function getDictItemById(params: string) {
  return request(`${resourceName}/${params}`);
}

export async function updateDictItem(params: SysDictItemForm) {
  return request(`${resourceName}/${params.id}`, {
    method: 'put',
    data: params,
  });
}
