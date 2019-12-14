import {Form, Input, Modal, Select, Spin} from 'antd';

import {FormComponentProps} from 'antd/es/form';
import React, {useEffect} from 'react';
import {SysRole} from "@/pages/sys/role/data";
import {SysUser} from "@/pages/sys/user/data";
import {WrappedFormUtils} from "antd/lib/form/Form";

const FormItem = Form.Item;
const { Option } = Select;

interface UpdateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleUpdate: (fieldsValue: SysUser, form: WrappedFormUtils<any>) => void;
  handleUpdateModalVisible: () => void;
  roles: SysRole[];
  user: Partial<SysUser>;
  loading: boolean;
}

const CreateForm: React.FC<UpdateFormProps> = props => {
  const {modalVisible, form, handleUpdate, handleUpdateModalVisible, roles, user, loading} = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleUpdate({
        ...fieldsValue,
        id: user.id
      }, form);
    });
  };
  const options = roles.map(role => <Option key={role.id}>{role.name}</Option>);
  useEffect(() => {
    form.setFieldsValue({
      username: user.username,
      roleIdList: user.roleIdList
    });
  }, [user]);
  return (
    <Modal
      destroyOnClose
      title="修改用户"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        form.resetFields();
        handleUpdateModalVisible();
      }}
      okButtonProps={{ disabled: loading }}
    >
      <Spin spinning={loading}>
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="用户名">
          {form.getFieldDecorator('username', {
            rules: [{required: true, message: '用户名为4到16位字符！', min: 4, max: 16}],
          })(<Input placeholder="请输入" autoComplete="off" />)}
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
      </Spin>
    </Modal>
  );
};

export default Form.create<UpdateFormProps>()(CreateForm);
