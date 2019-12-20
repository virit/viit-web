import React from "react";
import {Button, Col, Form, Input, List, Modal, Row, Select, Table, Typography} from "antd";
import {FormComponentProps} from "antd/es/form";

const FormItem = Form.Item;

interface Props extends FormComponentProps {
  visible: boolean;
  handleCancel: () => void;
}

const ConfigListenerModal: React.FC<Props> = ({visible, handleCancel, form}) => {

  const data = [
    '测试监听器',
    '测试监听器2',
  ];

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
      dataIndex: 'fieldName',
      key: 'fieldName',
    },
    {
      title: '值',
      dataIndex: 'fieldValue',
      key: 'fieldValue',
    },
  ];

  return (
    <Modal title="配置监听器" visible={visible} onCancel={handleCancel} width={800} maskClosable={false}>
      <div style={{marginBottom: '16px'}}>
        <Button icon="plus" type="primary">新增</Button>
      </div>
      <Row gutter={16}>
        <Col lg={6}>
          <List
            size="small"
            bordered
            dataSource={data}
            renderItem={item => (
              <List.Item>
                <Typography.Text>{item}</Typography.Text>
              </List.Item>
            )}
          />
        </Col>
        <Col lg={18}>
          <Form>
            <FormItem label="名称" {...inlineFormItemLayout}>
              {form.getFieldDecorator('name',)(
                <Input/>
              )}
            </FormItem>
            <FormItem label="类路径" {...inlineFormItemLayout}>
              {form.getFieldDecorator('name',)(
                <Input/>
              )}
            </FormItem>
            <FormItem label="事件" {...inlineFormItemLayout}>
              {form.getFieldDecorator('name',)(
                <Select />
              )}
            </FormItem>
            <FormItem label="参数" {...inlineFormItemLayout}>
              <Table size="small" columns={fieldColumns}></Table>
            </FormItem>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};
export default Form.create<Props>()(ConfigListenerModal);
