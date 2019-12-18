export interface DeptTreeItem {
  id: string;
  children: DeptTreeItem[];
  label: string;
}

export interface OrgaDept {
  id?: string,
  name: string;
  type?: string;
  code?: string;
  parentId?: string;
}
