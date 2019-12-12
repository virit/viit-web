import request from '@/utils/request';
import {SysUser, TableListParams, TablePageQuery} from './data.d';
import { toQueryParams } from '@/utils/pages';

const resourceName = '/sys/user';

export async function queryUser(params: TablePageQuery) {
  return request(resourceName, {
    params: toQueryParams(params),
  });
}

export async function queryUserDetails(id: string) {
  return request(`${resourceName}/${id}`);
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

export async function updateUser(params: SysUser) {
  return request(resourceName + '/' + params.id, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
