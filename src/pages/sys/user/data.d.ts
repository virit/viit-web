import { PageQuery } from '@/utils/pages';
import {Role} from "@/pages/sys/role/data";

export interface SysUser {
  id: string;
  username: string;
  key: number;
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  title: string;
  owner: string;
  desc: string;
  callNo: number;
  status: number;
  updatedAt: Date;
  createdAt: Date;
  progress: number;
  roleIdList: string[];
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: SysUser[];
  pagination: Partial<TableListPagination>;
  roles: Role[];
}

export interface TableListParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
}

export interface TablePageQuery extends PageQuery {
  fields: {};
}
