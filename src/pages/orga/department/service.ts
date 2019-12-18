import request from "@/utils/request";
import {DeptTreeItem, OrgaDept} from "./data";

const resourceName = '/orga/department';

export async function queryTree() {
  return request(`${resourceName}/tree`);
}

export async function queryInfo(id:string) {
  return request(`${resourceName}/${id}`);
}

export async function deleteRecord(id:string) {
  return request(`${resourceName}/${id}`, {
    method: 'delete',
  });
}

export async function createNewItem(record: OrgaDept) {
  return request(`${resourceName}`, {
    method: 'post',
    data: record,
  });
}

export async function update(record: OrgaDept) {
  return request(`${resourceName}/${record.id}`, {
    method: 'put',
    data: record,
  });
}

export async function saveOrder(menus: DeptTreeItem[]) {
  return request(`${resourceName}/tree/order`, {
    method: 'put',
    data: menus,
  });
}
