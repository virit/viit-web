import React, {useEffect} from 'react';
import {FormComponentProps} from "antd/es/form";
import {Form, Input, Modal, Spin} from "antd";
import {WrappedFormUtils} from "antd/es/form/Form";
import {SysRoleType, SysRoleTypeForm} from "@/pages/sys/roleType/data";

const FormItem = Form.Item;
const { TextArea } = Input;

interface UpdateFormProps extends FormComponentProps {
  modalVisible: boolean;
  loading: boolean;
  handleSubmit: (fields: SysRoleTypeForm, form: WrappedFormUtils) => void;
  onCancel: () => void;
  roleType: SysRoleType;
}

const UpdateForm:React.FC<UpdateFormProps> = ({ form, modalVisible, loading, handleSubmit, onCancel, roleType }) => {

  useEffect(() => {
    form.setFieldsValue({
      typeName: roleType.typeName,
      description: roleType.description,
    } as SysRoleTypeForm);
  }, [roleType]);

  const onOkButtonClick = () => {
    form.validateFields((err, fields) => {
      if (err) {
        return;
      }
      handleSubmit({
        ...fields,
        id: roleType.id,
      }, form);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="修改角色类型"
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
export default Form.create<UpdateFormProps>()(UpdateForm);
