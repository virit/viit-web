import request from "@/utils/request";

const resourceName = '/sys/menu';

export async function queryTreeMenus() {
  return request(`${resourceName}/tree`);
}

export async function queryMenuInfo(id:string) {
  return request(`${resourceName}/${id}`);
}
