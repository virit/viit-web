import request from '@/utils/request';
import {TableListParams, TablePageQuery} from './data.d';
import {toQueryParams} from "@/utils/pages";

const resourceName = "/sys/role-type";

export async function queryDictType(params: TablePageQuery) {
  return request(resourceName, {
    params: toQueryParams(params),
  });
}

export async function removeRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
