import React from 'react';
import {FormComponentProps} from "antd/es/form";
import {Form, Input, Modal, Spin, Select} from "antd";
import {WrappedFormUtils} from "antd/es/form/Form";
import {SysRole} from "@/pages/sys/role/data";
import {SysRoleType} from "@/pages/sys/roleType/data";

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  loading: boolean;
  handleSubmit: (fields: SysRole, form: WrappedFormUtils) => void;
  onCancel: () => void;
  roleTypes: SysRoleType[] | undefined;
}

const CreateForm:React.FC<CreateFormProps> = ({ form, modalVisible, loading, handleSubmit, onCancel, roleTypes }) => {

  const onOkButtonClick = () => {
    form.validateFields((err, fields) => {
      if (err) {
        return;
      }
      handleSubmit(fields, form);
    });
  };

  const roleTypeElements = (roleTypes || [] as SysRoleType[]).map(it => {
      return <Option key={it.id}>{it.typeName}</Option>;
  });

  return (
    <Modal
      destroyOnClose
      title="新建角色类型"
      visible={modalVisible}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      okButtonProps={{ disabled: loading, onClick: onOkButtonClick}}
    >
      <Spin spinning={loading}>
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="角色名称">
          {form.getFieldDecorator('name', {
            rules: [{required: true, message: '角色名称必填，长度最长为16位！', max: 16}],
          })(<Input placeholder="请输入" autoComplete="off"/>)}
        </FormItem>
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="角色标识">
          {form.getFieldDecorator('code', {
            rules: [{required: true, message: '角色标识必填，长度最长为16位！', max: 16}],
          })(<Input placeholder="请输入" autoComplete="off"/>)}
        </FormItem>
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="角色类型">
          {form.getFieldDecorator('typeId', {
            rules: [{required: true, message: '角色类型必填！'}],
          })(
            <Select style={{width: '100%'}} placeholder="请选择角色类型">
              { roleTypeElements }
            </Select>
          )}
        </FormItem>
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="描述">
          {form.getFieldDecorator('description', {
            rules: [{message: '描述信息最多32个字符！', max: 32}],
          })(
            <TextArea placeholder="请输入" autoComplete="off"/>
          )}
        </FormItem>
      </Spin>
    </Modal>
  );
};
export default Form.create<CreateFormProps>()(CreateForm);
