import React, {useEffect, useState} from "react";
import {Button, Col, Form, Input, Modal, Row, Select, Table} from "antd";
import {FormComponentProps} from "antd/es/form";
import styles from "./index.less";

const FormItem = Form.Item;

export interface EventType {
  text: string;
  value: any;
}

export interface FieldType {
  name: string;
  value: string;
  key?: any;
}

export interface ListenerData {
  name: string;
  classpath: string;
  event: string;
  fields: FieldType[];
  key?: any;
  index?: number;
}

interface Props extends FormComponentProps {
  visible: boolean;
  handleCancel: () => void;
  events: EventType[];
  listenerData: ListenerData[];
  handleSave: (data: ListenerData[]) => void;
  type: ListenerType;
}

export type ListenerType = 'task' | 'execution';

const ConfigListenerModal: React.FC<Props> = ({
                                                visible, handleCancel, form, events, listenerData, handleSave, type
                                              }) => {

  const [data, setData] = useState(listenerData);

  const [index, setIndex] = useState(0);

  // const [currentData, setCurrentData] = useState(data.length > 0 ? data[index] : undefined);

  const currentData = data.length > 0 ? data[index] : undefined;

  const onClickNew = () => {
    setIndex(data.length);
    setData([...data, {
      name: '新监听器',
      classpath: '',
      event: '',
      fields: [],
    }]);
  };

  useEffect(() => {
    setIndex(0);
    setData(listenerData);
  }, [visible]);

  useEffect(() => {
    if (currentData != undefined) {
      form.setFieldsValue({
        name: currentData.name,
        classpath: currentData.classpath,
        event: currentData.event,
      });
    }
  }, [data, index]);

  const saveItem = () => {
    form.validateFields((err, values) => {
      const newState = [...data];
      newState[index] = {...newState[index], ...values};
      setData(newState);
    });
  };

  const newField = () => {
    const fields = [...data[index].fields];
    fields.push({
      name: '',
      value: '',
    });
    setData(data.map(it => {
      if (it.index === index) {
        it.fields = fields;
      }
      return it;
    }));
  };

  const inlineFormItemLayout = {
    labelCol: {
      sm: {span: 4},
    },
    wrapperCol: {
      sm: {span: 20},
    },
  };

  const fieldColumns = [
    {
      title: '参数名称',
      dataIndex: 'name',
      key: 'name',
      render: (_: string, record: FieldType, i: number) => {
        return <Input
          value={record.name}
          size="small"
          onChange={(e) => {
            const field = data[index].fields[i];
            field.name = e.target.value;
            setData([...data]);
          }}
        />
      },
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
      render: (_: string, record: FieldType, i: number) => {
        return <Input
          value={record.value}
          size="small"
          onChange={(e) => {
            const field = data[index].fields[i];
            field.value = e.target.value;
            setData([...data]);
          }}
        />
      },
    },
    {
      title: '',
      width: 44,
      render: (_: any, __: any, i: number) => {
        return <a onClick={e => {
          e.preventDefault();
          data[index].fields = data[index].fields.filter((_, curIndex) => {
            return curIndex !== i;
          });
          setData([...data]);
        }}>删除</a>
      }
    }
  ];

  return (
    <Modal title={type === 'task' ? '配置任务监听器' : '配置执行监听器'} visible={visible} onCancel={handleCancel}
           width={880} maskClosable={false} onOk={() => {
      handleSave(data);
    }}>
      <div style={{marginBottom: '16px'}}>
        <Button icon="plus" type="primary" onClick={onClickNew}>新增</Button>
      </div>
      <Row gutter={8}>
        <Col lg={10}>
          <Table size="small"
                 className={styles.listenerTable}
                 showHeader={false}
                 columns={[
                   {
                     title: '监听器',
                     dataIndex: 'name',
                   },
                   {
                     title: '操作',
                     width: 44,
                     render: (value, record) => {
                       return (
                         <Button type="link" size="small"
                                 onClick={e => {
                                   e.preventDefault();
                                   if (index === data.length - 1) {
                                     setIndex(index - 1);
                                   }
                                   setData(data.filter(it => it.index !== record.index));
                                 }}>删除</Button>
                       )
                     }
                   },
                 ]}
                 dataSource={data.map((it, index) => {
                   it.key = index;
                   it.index = index;
                   return it;
                 })}
                 pagination={false}
                 bodyStyle={{
                   minHeight: data.length > 0 ? '438px' : '0',
                 }}
                 rowSelection={{
                   type: 'radio',
                   columnWidth: '30px',
                   selectedRowKeys: [index],
                   onChange: (selectedRowKeys) => {
                     const keys = selectedRowKeys as number[];
                     setIndex(keys[0]);
                   },
                 }}
                 onRow={(record, index) => {
                   return {
                     onClick: () => {
                       setIndex(index);
                     },
                   };
                 }}
          />
        </Col>
        <Col lg={14}>
          {
            currentData &&
            <Form>
              <FormItem label="名称" {...inlineFormItemLayout}>
                {form.getFieldDecorator('name',)(
                  <Input onBlur={saveItem}/>
                )}
              </FormItem>
              <FormItem label="类路径" {...inlineFormItemLayout}>
                {form.getFieldDecorator('classpath',)(
                  <Input onBlur={saveItem}/>
                )}
              </FormItem>
              <FormItem label="事件" {...inlineFormItemLayout}>
                {form.getFieldDecorator('event',)(
                  <Select onBlur={saveItem}>
                    {
                      events.map(event => <Select.Option value={event.value}>{event.text}</Select.Option>)
                    }
                  </Select>
                )}
              </FormItem>
              <FormItem label="参数" {...inlineFormItemLayout} style={{marginBottom: '0'}}>
                <div>
                  <Button type="link" style={{paddingLeft: '0'}} onClick={newField}>新增</Button>
                </div>
                <Table size="small"
                       columns={fieldColumns}
                       pagination={false}
                       bodyStyle={{
                         minHeight: data[index].fields.length > 0 ? '204px' : '0',
                       }}
                       dataSource={currentData !== undefined ? currentData.fields.map((it, i) => {
                         it.key = i;
                         return it;
                       }) : undefined}/>
              </FormItem>
            </Form>
          }
        </Col>
      </Row>
    </Modal>
  );
};
export default Form.create<Props>()(ConfigListenerModal);
