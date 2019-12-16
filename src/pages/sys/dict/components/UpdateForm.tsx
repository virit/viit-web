import React, {useEffect} from 'react';
import {FormComponentProps} from "antd/es/form";
import {Form, Input, Modal, Spin} from "antd";
import {WrappedFormUtils} from "antd/es/form/Form";
import {SysDict, SysDictForm} from "../data";

const FormItem = Form.Item;
const { TextArea } = Input;

interface UpdateFormProps extends FormComponentProps {
  modalVisible: boolean;
  loading: boolean;
  handleSubmit: (fields: SysDictForm, form: WrappedFormUtils) => void;
  onCancel: () => void;
  dict: SysDict;
}

const UpdateForm:React.FC<UpdateFormProps> = ({ form, modalVisible, loading, handleSubmit, onCancel, dict }) => {

  useEffect(() => {
    form.setFieldsValue({
      name: dict.name,
      code: dict.code,
      description: dict.description,
    } as SysDictForm);
  }, [dict]);

  const onOkButtonClick = () => {
    form.validateFields((err, fields) => {
      if (err) {
        return;
      }
      handleSubmit({
        ...fields,
        id: dict.id,
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
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="字典名称">
          {form.getFieldDecorator('name', {
            rules: [{required: true, message: '字典名称必填'}, {max: 16, message: '长度最长16位！'}],
          })(<Input placeholder="请输入" autoComplete="off"/>)}
        </FormItem>
        <FormItem labelCol={{span: 5}} wrapperCol={{span: 15}} label="字典标识">
          {form.getFieldDecorator('code', {
            rules: [{required: true, message: '字典标识必填'}, {max: 16, message: '长度最长16位！'}],
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
export default Form.create<UpdateFormProps>()(UpdateForm);
