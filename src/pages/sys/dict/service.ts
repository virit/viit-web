import {PageQuery, toQueryParams} from "@/utils/pages";
import request from "@/utils/request";
import {SysDictForm} from "./data";

const resourceName = '/sys/dict';

export async function queryDicts(params: PageQuery) {
  return request(resourceName, {
    params: toQueryParams(params)
  });
}

export async function newDict(params: SysDictForm) {
  return request(resourceName, {
    method: 'post',
    data: params,
  });
}

export async function deleteDict(params: string) {
  return request(`${resourceName}/${params}`, {
    method: 'delete'
  });
}

export async function getDictById(params: string) {
  return request(`${resourceName}/${params}`);
}

export async function updateDict(params: SysDictForm) {
  return request(`${resourceName}/${params.id}`, {
    method: 'put',
    data: params,
  });
}
