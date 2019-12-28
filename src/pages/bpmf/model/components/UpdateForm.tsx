import React, {useEffect} from 'react';
import {FormComponentProps} from "antd/es/form";
import {Form, Input, Modal, Spin} from "antd";
import {WrappedFormUtils} from "antd/es/form/Form";
import {ProcessModel, ProcessModelForm} from "../data";

const FormItem = Form.Item;

interface UpdateFormProps extends FormComponentProps {
  modalVisible: boolean;
  loading: boolean;
  handleSubmit: (fields: ProcessModelForm, form: WrappedFormUtils) => void;
  onCancel: () => void;
  record: ProcessModel;
}

const UpdateForm:React.FC<UpdateFormProps> = ({ form, modalVisible, loading, handleSubmit, onCancel, record }) => {

  useEffect(() => {
    form.setFieldsValue({
      name: record.name,
      key: record.key,
    } as ProcessModel);
  }, [record]);

  const onOkButtonClick = () => {
    form.validateFields((err, fields) => {
      if (err) {
        return;
      }
      handleSubmit({
        ...fields,
        id: record.id,
      }, form);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="修改数据字典"
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
export default Form.create<UpdateFormProps>()(UpdateForm);
