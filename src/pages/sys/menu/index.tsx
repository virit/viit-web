import React, {useEffect, useState} from 'react';
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {Button, Card, Col, Form, Input, Modal, Radio, Row, Spin, Tree} from "antd";
import {MenuTreeItem} from "@/pages/sys/menu/data";
import {connect} from "dva";
import {StateType} from "@/pages/sys/menu/model";
import {Action, Dispatch} from "redux";
import {checkBreakPoint} from "@/utils/viit/GridBreakPoint";
import DocumentSize from "@/utils/viit/DocumentSize";
import {FormComponentProps} from "antd/es/form";

const {TreeNode} = Tree;

interface Props extends FormComponentProps {
  sysMenu: StateType;
  dispatch: Dispatch<Action<| 'sysMenu/fetchMenus'
    | 'sysMenu/queryMenuInfo'>>;
}

const SysMenuComponent: React.FC<Props> = ({sysMenu, dispatch, form}) => {

  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [infoModal, setInfoModal] = useState({
    visible: false,
    loading: false,
  });
  const size = DocumentSize();
  const formValues = sysMenu.data.formValues;

  const fetchTreeMenu = () => {
    setLoading(true);
    dispatch({
      type: 'sysMenu/fetchMenus',
      callback: () => {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchTreeMenu();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      title: formValues.title,
      type: formValues.type,
      url: formValues.url,
    });
  }, [formValues]);

  const onClickNode = ([id]: string[]) => {
    if (id !== undefined) {
      setSelectedId(id);
      setInfoModal({visible: true, loading: true});
      dispatch({
        type: 'sysMenu/queryMenuInfo',
        payload: id,
        callback: function () {
          setInfoModal({visible: true, loading: false});
        }
      });
    }
  };

  const renderTreeNodes: any = (data: MenuTreeItem[]) => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.label} key={item.id} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode title={item.label} key={item.id} dataRef={item}/>;
    });
  };

  const infoForm = (
    <Spin spinning={infoModal.loading}>
      <Form.Item label="菜单名称" labelCol={{span: 5}} wrapperCol={{span: 19}}>
        {form.getFieldDecorator('title', {
          rules: [{required: true, message: '用户名为4到16位字符！', min: 4, max: 16}],
        })(
          <Input/>
        )}
      </Form.Item>

      <Form.Item label="菜单类型" labelCol={{span: 5}} wrapperCol={{span: 19}}>
        {form.getFieldDecorator('type', {
          rules: [{required: true, message: '用户名为4到16位字符！', min: 4, max: 16}],
        })(
          <Radio.Group>
            <Radio value={1}>菜单</Radio>
            <Radio value={2}>按钮</Radio>
          </Radio.Group>
        )}
      </Form.Item>

      <Form.Item label="页面路径" labelCol={{span: 5}} wrapperCol={{span: 19}}>
        {form.getFieldDecorator('url', {
          rules: [{required: true}],
        })(
          <Input/>
        )}
      </Form.Item>
      {checkBreakPoint(['xs', 'sm'], size.width) ? <></> :
      <Form.Item labelCol={{span: 5}} wrapperCol={{span: 19, push: 5}}>
        <Button type="primary">修改</Button>
      </Form.Item>
      }
    </Spin>
  );

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <div style={{marginBottom: '16px'}}>
          <Button icon="plus" type="primary" style={{marginRight: '8px'}}>
            新建
          </Button>
          {
            selectedId &&
            <Button>
              删除
            </Button>
          }
        </div>
        <Row>
          <Col xl={6} sm={8} xxl={6} md={8} xs={24}>
            <Spin spinning={loading}>
              <Tree draggable onSelect={onClickNode} autoExpandParent>
                {renderTreeNodes(sysMenu.data.menuData)}
              </Tree>
            </Spin>
          </Col>
          <Col xl={12} sm={16} xxl={8} md={16} xs={24}>
            {checkBreakPoint(['xs', 'sm'], size.width) ?
              <Modal okButtonProps={{disabled: infoModal.loading}} visible={infoModal.visible}
                     title="菜单信息"
                     onCancel={() => setInfoModal({...infoModal, visible: false})}
              >
                {infoForm}
              </Modal> : infoForm
            }
          </Col>
        </Row>
      </Card>
    </PageHeaderWrapper>
  );
};
const formFC = Form.create<Props>()(SysMenuComponent);
export default connect(({sysMenu}: { sysMenu: StateType }) => {
  return {sysMenu};
})(formFC);
