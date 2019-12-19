import {Button, Card, Form, Input, Select} from 'antd';
import React, {useState} from 'react';

import {FormComponentProps} from 'antd/es/form';
import ConfigAssigneeModal from "@/pages/bpmf/Editor/components/modal/ConfigAssigneeModal";
import {withPropsAPI} from "gg-editor";

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
  const {getSelected, executeCommand, update} = propsAPI;
  if (!item) {
    return null;
  }

  const [assigneeModalState, setAssigneeModalState] = useState({visible: false});

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
        executeCommand(() => {
          update(item, {
            ...values,
          });
        });
      });
    }, 0);
  };

  const renderEdgeShapeSelect = () => (
    <Select onChange={handleSubmit}>
      <Option value="flow-smooth">Smooth</Option>
      <Option value="flow-polyline">Polyline</Option>
      <Option value="flow-polyline-round">Polyline Round</Option>
    </Select>
  );

  const renderNodeDetail = () => {
    const {label} = item.getModel();

    return (
      <>
        <Item label="任务名称" {...inlineFormItemLayout}>
          {form.getFieldDecorator('name', {
            initialValue: label,
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
          {form.getFieldDecorator('taskListener', {})(<>0<Button type="link">配置</Button></>)}
        </Item>
        <Item label="执行监听器" {...inlineFormItemLayout}>
          {form.getFieldDecorator('executionListener', {})(<>0<Button type="link">配置</Button></>)}
        </Item>
      </>
    );
  };

  const renderEdgeDetail = () => {
    const {label = '', shape = 'flow-smooth'} = item.getModel();

    return (
      <>
        <Item label="Label" {...inlineFormItemLayout}>
          {form.getFieldDecorator('label', {
            initialValue: label,
          })(<Input onBlur={handleSubmit}/>)}
        </Item>
        <Item label="Shape" {...inlineFormItemLayout}>
          {form.getFieldDecorator('shape', {
            initialValue: shape,
          })(renderEdgeShapeSelect())}
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
        {type === 'node' && renderNodeDetail()}
        {type === 'edge' && renderEdgeDetail()}
        {type === 'group' && renderGroupDetail()}
      </Form>
      <ConfigAssigneeModal visible={assigneeModalState.visible} handleCancel={() => {
        setAssigneeModalState({visible: false});
      }}/>
    </Card>
  );
};
export default Form.create<DetailFormProps>()(withPropsAPI(DetailForm as any));
