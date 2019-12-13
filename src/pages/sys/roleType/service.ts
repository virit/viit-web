import {PageQuery, toQueryParams} from "@/utils/pages";
import request from "@/utils/request";
import {SysRoleTypeForm} from "@/pages/sys/roleType/data";

const resourceName = '/sys/role-type';

export async function queryRoleTypes(params: PageQuery) {
  return request(resourceName, {
    params: toQueryParams(params)
  });
}

export async function newRoleType(params: SysRoleTypeForm) {
  return request(resourceName, {
    method: 'post',
    data: params,
  });
}

export async function deleteRoleType(params: string) {
  return request(`${resourceName}/${params}`, {
    method: 'delete'
  });
}
