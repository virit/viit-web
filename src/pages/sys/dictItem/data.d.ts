interface SysDictItem {
  // id
  id: string;
  // 文本
  text: string;
  // 值
  value: string;
  // 字典id
  dictId: string;
  // 创建时间
  createDate: string;
  // 更新时间
  updateDate: string;
}

export interface SysDictItemForm {
  id?: string;
  text: string;
  value: string;
  dictId: string;
  description?: string;
}
