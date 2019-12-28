interface ProcessModel {
  // id
  id: string;
  // 流程名称
  name: string;
  // 流程key
  key: string;
}

export interface ProcessModelForm {
  id?: string;
  name: string;
  key: string;
}
