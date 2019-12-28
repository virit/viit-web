import {PageQuery, toQueryParams} from "@/utils/pages";
import request from "@/utils/request";
import {ProcessModelForm} from "./data";

const resourceName = '/bpmf/model';

export async function queryModels(params: PageQuery) {
  return request(resourceName, {
    params: toQueryParams(params)
  });
}

export async function newModel(params: ProcessModelForm) {
  return request(resourceName, {
    method: 'post',
    data: params,
  });
}

export async function deleteModel(params: string) {
  return request(`${resourceName}/${params}`, {
    method: 'delete'
  });
}

export async function getModelById(params: string) {
  return request(`${resourceName}/${params}`);
}

export async function updateModel(params: ProcessModelForm) {
  return request(`${resourceName}/${params.id}`, {
    method: 'put',
    data: params,
  });
}

export async function saveEditorSource(id: string, data: string) {
  return request(`${resourceName}/editor-source/${id}`, {
    method: 'post',
    data,
    contentType: 'application/octet-stream',
  });
}

export async function getEditorJsonSource(id: string) {
  return request(`${resourceName}/editor-source/json/${id}`);
}

export async function deploy(id: string) {
  return request(`${resourceName}/deploy/${id}`, {
    method: 'post',
  });
}
