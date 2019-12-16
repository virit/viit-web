interface SysDict {
  // id
  id: string;
  //类型名称
  name: string;
  // 类型描述
  code: string;
  // 创建时间
  description: string;
  // 创建时间
  createDate: string;
  // 更新时间
  updateDate: string;
}

export interface SysDictForm {
  id?: string;
  name: string;
  code: string;
  description?: string;
}
