import request from '@/utils/request';
import { TableListParams, TablePageQuery } from './data.d';
import { toQueryParams } from '@/utils/pages';

const resourceName = '/sys/user';

export async function queryRule(params: TablePageQuery) {
  return request(resourceName, {
    params: toQueryParams(params),
  });
}

export async function removeUser(params: TableListParams) {
  return request(resourceName + '/' + params, {
    method: 'DELETE',
  });
}

export async function addUser(params: TableListParams) {
  return request(resourceName, {
    method: 'POST',
    data: {
      ...params,
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
