import {PageQuery, toQueryParams} from "@/utils/pages";
import request from "@/utils/request";
import {SysRoleTypeForm} from "@/pages/sys/roleType/data";

const resourceName = '/sys/role';

export async function query(params: PageQuery) {
  return request(resourceName, {
    params: toQueryParams(params)
  });
}

export async function newRecord(params: SysRoleTypeForm) {
  return request(resourceName, {
    method: 'post',
    data: params,
  });
}

export async function deleteRecords(params: string) {
  return request(`${resourceName}/${params}`, {
    method: 'delete'
  });
}

export async function get(params: string) {
  return request(`${resourceName}/${params}`);
}

export async function update(params: SysRoleTypeForm) {
  return request(`${resourceName}/${params.id}`, {
    method: 'put',
    data: params,
  });
}
