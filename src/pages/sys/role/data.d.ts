import {PageQuery} from "@/utils/pages";

interface SysRole {
  // id
  id: string;
  //角色名称
  name: string;
  // 角色标识
  code: string;
  // 角色类型id
  typeId: string;
  // 描述
  description: string;
  // 创建时间
  createDate: string;
  // 更新时间
  updateDate: string;
  menuIdList?: string[];
  infoFields: any;
}

export interface SysRoleForm {
  id?: string;
  //角色名称
  name: string;
  // 角色标识
  code: string;
  // 角色类型id
  typeId: string;
  // 描述
  description: string;
}
