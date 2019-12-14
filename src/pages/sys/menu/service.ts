import request from "@/utils/request";
import {SysMenu} from "@/pages/sys/menu/data";

const resourceName = '/sys/menu';

export async function queryTreeMenus() {
  return request(`${resourceName}/tree`);
}

export async function queryMenuInfo(id:string) {
  return request(`${resourceName}/${id}`);
}

export async function deleteRecord(id:string) {
  return request(`${resourceName}/${id}`, {
    method: 'delete',
  });
}

export async function newMenu(record: SysMenu) {
  return request(`${resourceName}`, {
    method: 'post',
    data: record,
  });
}

export async function updateMenu(record: SysMenu) {
  return request(`${resourceName}/${record.id}`, {
    method: 'put',
    data: record,
  });
}

export async function getRouter() {
  return request(`${resourceName}/router/antd`);
}
