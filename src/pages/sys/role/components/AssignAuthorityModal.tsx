import React, {useEffect, useState} from 'react';
import {Modal, Spin, Tree} from "antd";
import {MenuTreeItem} from "@/pages/sys/menu/data";
import {SysRole} from "@/pages/sys/role/data";

const {TreeNode} = Tree;

interface Props {
  treeData: [];
  record: SysRole | {};
  visible: boolean;
  onCancel: () => void;
  handleAssign: (id: string, menus: string[]) => void;
  loading: boolean;
}

const AssignAuthorityModal: React.FC<Props> = ({treeData, record, visible, onCancel, handleAssign, loading}) => {

  const sysRole = record as SysRole;
  const [selectedKeys, setSelectedKeys] = useState(sysRole.menuIdList || []);

  useEffect(() => {
    setSelectedKeys(sysRole.menuIdList || []);
  }, [record]);

  const renderTreeNodes: any = (data: MenuTreeItem[]) => {
    if (data === undefined) {
      return;
    }
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.label} key={item.id} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode title={item.label} key={item.id} dataRef={item}/>;
    });
  };

  return (
    <Modal visible={visible} title="分配权限" onCancel={onCancel} onOk={() => {
      handleAssign(sysRole.id, selectedKeys);
    }} okButtonProps={{ disabled: loading}}>
      <Spin spinning={treeData === undefined || loading}>
        <Tree
          checkable={true}
          checkedKeys={selectedKeys}
          onCheck={(keys) => {
            setSelectedKeys(keys as string[]);
          }}
        >
          {renderTreeNodes(treeData)}
        </Tree>
      </Spin>
    </Modal>
  )
};
export default AssignAuthorityModal;
