import React, {useState} from "react";
import {Button, Modal, Select, Table} from "antd";

interface Props {
  visible: boolean;
  handleCancel: () => void;
}

interface Assignee {
  department: [],
  role: [],
}

const ConfigAssigneeModal:React.FC<Props> = ({ visible, handleCancel }) => {

  const [dataSource, setDataSource] = useState([] as Assignee[]);

  const handleNewItem = (e:any) => {
    e.preventDefault();
    const newDataSource = [...dataSource];
    newDataSource.push({} as Assignee);
    console.log(newDataSource);
    setDataSource(newDataSource)
  };

  const columns = [
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      render() {
        return <Select style={{width: '100%'}}/>
      },
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render() {
        return <Select style={{width: '100%'}}/>
      },
    },
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      render() {
        return <Select style={{width: '100%'}}/>
      },
    },
  ];

  return (
    <Modal title="配置处理人" visible={visible} onCancel={handleCancel} width={720} maskClosable={false}>
      <p>
        说明：配置说明
      </p>
      <div style={{marginBottom: '16px'}}>
        <Button icon="plus" type="primary" onClick={handleNewItem}>新增</Button>
      </div>
      <Table dataSource={dataSource} columns={columns} size="small" pagination={false}/>
    </Modal>
  );
};
export default ConfigAssigneeModal;
