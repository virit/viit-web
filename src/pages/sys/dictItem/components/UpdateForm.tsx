import React, {useEffect} from 'react';
import {FormComponentProps} from "antd/es/form";
import {Form, Input, Modal, Spin} from "antd";
import {WrappedFormUtils} from "antd/es/form/Form";
import {SysDictItem, SysDictItemForm} from "../data";

const FormItem = Form.Item;

interface UpdateFormProps extends FormComponentProps {
  modalVisible: boolean;
  loading: boolean;
  handleSubmit: (fields: SysDictItemForm, form: WrappedFormUtils) => void;
  onCancel: () => void;
  dictItem: SysDictItem;
}

const UpdateForm:React.FC<UpdateFormProps> = ({ form, modalVisible, loading, handleSubmit, onCancel, dictItem }) => {

  useEffect(() => {
    form.setFieldsValue({
      text: dictItem.text,
      value: dictItem.value,
    } as SysDictItemForm);
  }, [dictItem]);

  const onOkButtonClick = () => {
    form.validateFields((err, fields) => {
      if (err) {
        return;
      }
      handleSubmit({
        ...fields,
        id: dictItem.id,
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
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="字典项">
          {form.getFieldDecorator('text', {
            rules: [{required: true, message: '字典项必填'}, {max: 32, message: '长度最长32位！'}],
          })(<Input placeholder="请输入" autoComplete="off"/>)}
        </FormItem>
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="字典值">
          {form.getFieldDecorator('value', {
            rules: [{required: true, message: '字典值必填'}, {max: 16, message: '长度最长16位！'}],
          })(<Input placeholder="请输入" autoComplete="off"/>)}
        </FormItem>
      </Spin>
    </Modal>
  );
};
export default Form.create<UpdateFormProps>()(UpdateForm);
