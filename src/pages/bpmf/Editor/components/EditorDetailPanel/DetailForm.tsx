import {Button, Card, Form, Input, Select} from 'antd';
import React, {useState} from 'react';

import {FormComponentProps} from 'antd/es/form';
import ConfigAssigneeModal from "@/pages/bpmf/Editor/components/modal/ConfigAssigneeModal";
import {withPropsAPI} from "gg-editor";
import ConfigListenerModal, {
  EventType,
  ListenerData,
  ListenerType
} from "@/pages/bpmf/Editor/components/modal/ConfigListenerModal";

const {Item} = Form;
const {Option} = Select;

const inlineFormItemLayout = {
  labelCol: {
    sm: {span: 8},
  },
  wrapperCol: {
    sm: {span: 16},
  },
};

interface DetailFormProps extends FormComponentProps {
  type: string;
  propsAPI?: any;
}


const DetailForm: React.FC<DetailFormProps> = ({form, type, propsAPI}) => {

  const item = propsAPI.getSelected()[0];
  const model = item.getModel();
  const {getSelected, executeCommand, update} = propsAPI;
  if (!item) {
    return null;
  }

  const [assigneeModalState, setAssigneeModalState] = useState({visible: false});
  const [configListenerState, setConfigListenerState] = useState({visible: false});
  const [executionListenerData, setExecutionListenerData] =
    useState(item.getModel().executionListenerData as ListenerData[]);
  const [taskListenerData, setTaskListenerData] =
    useState(item.getModel().taskListenerData as ListenerData[]);

  const executionEvents = [
    {
      text: '开始',
      value: 'start',
    },
    {
      text: '结束',
      value: 'end',
    },
  ] as EventType[];

  const taskEvents = [
    {
      text: '创建',
      value: 'create',
    },
    {
      text: '签收',
      value: 'assignment',
    },
    {
      text: '完成',
      value: 'complete',
    },
    {
      text: '删除',
      value: 'delete',
    },
  ] as EventType[];

  const [listenerType, setListenerType] = useState('listener' as ListenerType);

  const handleSubmit = (e: React.FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    setTimeout(() => {
      form.validateFieldsAndScroll((err, values) => {
        if (err) {
          return;
        }
        const item = getSelected()[0];
        if (!item) {
          return;
        }
        values['label'] = values['name'];
        executeCommand(() => {
          update(item, {
            ...values,
          });
        });
      });
    }, 0);
  };

  const handleConfigListener = () => {
    setConfigListenerState({
      ...configListenerState,
      visible: true,
    });
  };

  const renderEdgeShapeSelect = () => (
    <Select onChange={handleSubmit}>
      <Option value="flow-smooth">平滑</Option>
      <Option value="flow-polyline">折线</Option>
      <Option value="flow-polyline-round">圆角折线</Option>
    </Select>
  );

  const renderStartDetail = () => {
    return (
      <>
        <Item label="名称" {...inlineFormItemLayout}>
          {form.getFieldDecorator('name', {
            initialValue: model.name,
          })(<Input onBlur={handleSubmit}/>)}
        </Item>
        <Item label="表单" {...inlineFormItemLayout}>
          {form.getFieldDecorator('form', {})(<Input onBlur={handleSubmit}/>)}
        </Item>
        <Item label="执行监听器" {...inlineFormItemLayout}>
          {form.getFieldDecorator('executionListener', {})(
            <>{executionListenerData.length}
              <Button type="link" onClick={_ => {
                setListenerType('execution');
                handleConfigListener();
              }}>配置</Button>
            </>
          )}
        </Item>
      </>
    );
  };

  const renderEndDetail = () => {
    return (
      <>
        <Item label="名称" {...inlineFormItemLayout}>
          {form.getFieldDecorator('name', {
            initialValue: model.name,
          })(<Input onBlur={handleSubmit}/>)}
        </Item>
        <Item label="执行监听器" {...inlineFormItemLayout}>
          {form.getFieldDecorator('executionListener', {})(
            <>{executionListenerData.length}
              <Button type="link" onClick={_ => {
                setListenerType('execution');
                handleConfigListener();
              }}>配置</Button>
            </>
          )}
        </Item>
      </>
    );
  };

  const renderTaskDetail = () => {

    return (
      <>
        <Item label="任务名称" {...inlineFormItemLayout}>
          {form.getFieldDecorator('name', {
            initialValue: model.name,
          })(<Input onBlur={handleSubmit}/>)}
        </Item>
        <Item label="表单" {...inlineFormItemLayout}>
          {form.getFieldDecorator('form', {})(<Input onBlur={handleSubmit}/>)}
        </Item>
        <Item label="处理人配置" {...inlineFormItemLayout}>
          {form.getFieldDecorator('assignee', {})(
            <Input onBlur={handleSubmit} readOnly={true} onClick={() => setAssigneeModalState({visible: true})}/>
          )}
        </Item>
        <Item label="任务监听器" {...inlineFormItemLayout}>
          {form.getFieldDecorator('taskListener', {})(
            <>
              {taskListenerData.length}
              <Button type="link" onClick={_ => {
                setListenerType('task');
                handleConfigListener();
              }}>配置</Button>
            </>
          )}
        </Item>
        <Item label="执行监听器" {...inlineFormItemLayout}>
          {form.getFieldDecorator('executionListener', {})(
            <>
              {executionListenerData.length}
              <Button type="link" onClick={_ => {
                setListenerType('execution');
                handleConfigListener();
              }}>配置</Button>
            </>
          )}
        </Item>
      </>
    );
  };

  const renderGatewayDetail = () => {
    return <>
      <Item label="名称" {...inlineFormItemLayout}>
        {form.getFieldDecorator('name', {
          initialValue: model.name,
        })(<Input onBlur={handleSubmit}/>)}
      </Item>
    </>
  };

  const renderEdgeDetail = () => {
    const {label = '', shape = 'flow-smooth', condition} = item.getModel();

    return (
      <>
        <Item label="名称" {...inlineFormItemLayout}>
          {form.getFieldDecorator('name', {
            initialValue: label,
          })(<Input onBlur={handleSubmit}/>)}
        </Item>
        <Item label="形状" {...inlineFormItemLayout}>
          {form.getFieldDecorator('shape', {
            initialValue: shape,
          })(renderEdgeShapeSelect())}
        </Item>
        <Item label="流转条件" {...inlineFormItemLayout}>
          {form.getFieldDecorator('condition', {
            initialValue: condition,
          })(<Input onBlur={handleSubmit}/>)}
        </Item>
      </>
    );
  };

  const renderGroupDetail = () => {
    const {label = '新建分组'} = item.getModel();

    return (
      <Item label="Label" {...inlineFormItemLayout}>
        {form.getFieldDecorator('label', {
          initialValue: label,
        })(<Input onBlur={handleSubmit}/>)}
      </Item>
    );
  };

  return (
    <Card type="inner" size="small" title='节点信息' bordered={false}>
      <Form onSubmit={handleSubmit}>
        {model.type === 'start' && renderStartDetail()}
        {model.type === 'end' && renderEndDetail()}
        {model.type === 'task' && renderTaskDetail()}
        {model.type === 'gateway' && renderGatewayDetail()}
        {type === 'edge' && renderEdgeDetail()}
        {type === 'group' && renderGroupDetail()}
      </Form>
      {
        ['task'].indexOf(item.model.type) !== -1 &&
        <ConfigAssigneeModal visible={assigneeModalState.visible} handleCancel={() => {
          setAssigneeModalState({visible: false});
        }}/>
      }
      {
        ['start', 'task', 'end'].indexOf(item.model.type) !== -1 &&
        <ConfigListenerModal
          type={listenerType}
          listenerData={listenerType === 'task' ? taskListenerData : executionListenerData}
          events={listenerType === 'task' ? taskEvents : executionEvents}
          visible={configListenerState.visible}
          handleCancel={() => {
            setConfigListenerState({visible: false});
          }}
          handleSave={(data) => {
            form.validateFieldsAndScroll((err, values) => {
              const item = getSelected()[0];
              if (!item) {
                return;
              }
              values['label'] = values['name'];
              if (listenerType === 'execution') {
                setExecutionListenerData(data);
                executeCommand(() => {
                  update(item, {
                    ...values,
                    executionListenerData: data,
                  });
                });
              } else if (listenerType === 'task') {
                setTaskListenerData(data);
                executeCommand(() => {
                  update(item, {
                    ...values,
                    taskListenerData: data,
                  });
                });
              }
            });
            setConfigListenerState({
              ...configListenerState,
              visible: false,
            });
          }}
        />
      }
    </Card>
  );
};
export default Form.create<DetailFormProps>()(withPropsAPI(DetailForm as any));
