import {Button, Card, Form, Input, Select} from 'antd';
import React, {useState} from 'react';

import {FormComponentProps} from 'antd/es/form';
import ConfigAssigneeModal from "@/pages/bpmf/Editor/components/modal/ConfigAssigneeModal";
import {withPropsAPI} from "gg-editor";
import ConfigListenerModal from "@/pages/bpmf/Editor/components/modal/ConfigListenerModal";

const upperFirst = (str: string) =>
  str.toLowerCase().replace(/( |^)[a-z]/g, (l: string) => l.toUpperCase());

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
          {form.getFieldDecorator('executionListener', {})(<>0<Button type="link" onClick={handleConfigListener}>配置</Button></>)}
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
          {form.getFieldDecorator('executionListener', {})(<>0<Button type="link">配置</Button></>)}
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
          {form.getFieldDecorator('taskListener', {})(<>0<Button type="link" onClick={handleConfigListener}>配置</Button></>)}
        </Item>
        <Item label="执行监听器" {...inlineFormItemLayout}>
          {form.getFieldDecorator('executionListener', {})(<>0<Button type="link" onClick={handleConfigListener}>配置</Button></>)}
        </Item>
      </>
    );
  };

  const renderEdgeDetail = () => {
    const {label = '', shape = 'flow-smooth'} = item.getModel();

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
          {form.getFieldDecorator('a')(<Input onBlur={handleSubmit}/>)}
        </Item>
        <Item label="执行监听器" {...inlineFormItemLayout}>
          {form.getFieldDecorator('executionListener', {})(<>0<Button type="link">配置</Button></>)}
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
    <Card type="inner" size="small" title={upperFirst(type)} bordered={false}>
      <Form onSubmit={handleSubmit}>
        {model.type === 'task' && renderTaskDetail()}
        {model.type === 'start' && renderStartDetail()}
        {model.type === 'end' && renderEndDetail()}
        {type === 'edge' && renderEdgeDetail()}
        {type === 'group' && renderGroupDetail()}
      </Form>
      <ConfigAssigneeModal visible={assigneeModalState.visible} handleCancel={() => {
        setAssigneeModalState({visible: false});
      }}/>
      <ConfigListenerModal visible={configListenerState.visible} handleCancel={() => {
        setConfigListenerState({visible: false});
      }}/>
    </Card>
  );
};
export default Form.create<DetailFormProps>()(withPropsAPI(DetailForm as any));
