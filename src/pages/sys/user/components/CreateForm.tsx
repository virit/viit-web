import {Form, Input, Modal, Select} from 'antd';

import {FormComponentProps} from 'antd/es/form';
import React from 'react';
import {Role} from "@/pages/sys/role/data";

const FormItem = Form.Item;
const { Option } = Select;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleAdd: (fieldsValue: { desc: string }) => void;
  handleModalVisible: () => void;
  roles: Role[];
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const {modalVisible, form, handleAdd, handleModalVisible, roles} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  const options = roles.map(role => <Option key={role.code}>{role.name}</Option>);
  return (
    <Modal
      destroyOnClose
      title="新建用户"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="用户名">
        {form.getFieldDecorator('username', {
          rules: [{required: true, message: '用户名为4到16位字符！', min: 4, max: 16}],
        })(<Input placeholder="请输入" autoComplete="off"/>)}
      </FormItem>
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="密码">
        {form.getFieldDecorator('password', {
          rules: [{required: true, message: '密码长度为6到16位！', min: 6, max: 16}],
        })(<Input type="text" placeholder="请输入" autoComplete="off"/>)}
      </FormItem>
      <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="角色">
        {form.getFieldDecorator('roleIdList')(
          <Select
            mode="multiple"
            style={{width: '100%'}}
            placeholder="请选择角色"
          >
            { options }
          </Select>
        )}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
