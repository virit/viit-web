import React from 'react';
import {FormComponentProps} from "antd/es/form";
import {Form, Input, Modal, Spin} from "antd";
import {WrappedFormUtils} from "antd/es/form/Form";
import {ProcessModelForm} from "../data";

const FormItem = Form.Item;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  loading: boolean;
  handleSubmit: (fields: ProcessModelForm, form: WrappedFormUtils) => void;
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
      title="新建流程模型"
      visible={modalVisible}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      okButtonProps={{ disabled: loading, onClick: onOkButtonClick}}
    >
      <Spin spinning={loading}>
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="流程名称">
          {form.getFieldDecorator('name', {
            rules: [{required: true, message: '流程名称必填'}, {max: 16, message: '长度最长16位！'}],
          })(<Input placeholder="请输入" autoComplete="off"/>)}
        </FormItem>
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="流程标识">
          {form.getFieldDecorator('key', {
            rules: [{required: true, message: '流程标识必填'}, {max: 16, message: '长度最长16位！'}],
          })(<Input placeholder="请输入" autoComplete="off"/>)}
        </FormItem>
      </Spin>
    </Modal>
  );
};
export default Form.create<CreateFormProps>()(CreateForm);
