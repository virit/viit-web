import React from 'react';
import {FormComponentProps} from "antd/es/form";
import {Form, Input, Modal, Spin} from "antd";
import {WrappedFormUtils} from "antd/es/form/Form";
import {SysRoleTypeForm} from "@/pages/sys/roleType/data";

const FormItem = Form.Item;
const { TextArea } = Input;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  loading: boolean;
  handleSubmit: (fields: SysRoleTypeForm, form: WrappedFormUtils) => void;
  onCancel: () => void;
}

const CreateForm:React.FC<CreateFormProps> = ({ form, modalVisible, loading, handleSubmit, onCancel }) => {

  const onOkButtonClick = () => {
    form.validateFields((err, fields) => {
      if (err) {
        return;
      }
      handleSubmit(fields, form);
    });
  };

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
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="类型名称">
          {form.getFieldDecorator('typeName', {
            rules: [{required: true, message: '类型名称必填，长度最长为16位！', max: 16}],
          })(<Input placeholder="请输入" autoComplete="off"/>)}
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
