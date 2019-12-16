export interface MenuTreeItem {
  id: string;
  children: MenuTreeItem[];
  label: string;
}

export interface SysMenu {
  id?: string,
  title: string;
  url?: string;
  authority?: string;
  type: number;
  parentId?: string;
  hide?: number;
}
