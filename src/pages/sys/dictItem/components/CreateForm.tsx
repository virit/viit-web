import React from 'react';
import {FormComponentProps} from "antd/es/form";
import {Form, Input, Modal, Spin} from "antd";
import {WrappedFormUtils} from "antd/es/form/Form";
import {SysDictItemForm} from "../data";

const FormItem = Form.Item;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  loading: boolean;
  handleSubmit: (fields: SysDictItemForm, form: WrappedFormUtils) => void;
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
      title="新建数据字典"
      visible={modalVisible}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      okButtonProps={{ disabled: loading, onClick: onOkButtonClick}}
    >
      <Spin spinning={loading}>
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="字典名称">
          {form.getFieldDecorator('text', {
            rules: [{required: true, message: '字典名称必填'}, {max: 32, message: '长度最长32位！'}],
          })(<Input placeholder="请输入" autoComplete="off"/>)}
        </FormItem>
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="字典名称">
          {form.getFieldDecorator('value', {
            rules: [{required: true, message: '字典标识必填'}, {max: 16, message: '长度最长16位！'}],
          })(<Input placeholder="请输入" autoComplete="off"/>)}
        </FormItem>
      </Spin>
    </Modal>
  );
};
export default Form.create<CreateFormProps>()(CreateForm);
