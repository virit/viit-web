import React, {useEffect, useState} from 'react';
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {Button, Card, Checkbox, Col, Form, Input, message, Modal, Radio, Row, Spin, Tree} from "antd";
import {MenuTreeItem, SysMenu} from "@/pages/sys/menu/data";
import {connect} from "dva";
import {StateType} from "@/pages/sys/menu/model";
import {Action, Dispatch} from "redux";
import {checkBreakPoint} from "@/utils/viit/GridBreakPoint";
import DocumentSize from "@/utils/viit/DocumentSize";
import {FormComponentProps} from "antd/es/form";
import AuthorityChecker from "@/viit/components/auth/AuthorityChecker";

const {TreeNode} = Tree;

type ActionType = 'sysMenu/fetchMenus'
  | 'sysMenu/queryMenuInfo'
  | 'sysMenu/delete'
  | 'sysMenu/saveFormValues'
  | 'sysMenu/insert'
  | 'sysMenu/update'
  | 'sysMenu/updateOneTreeNode';

interface Props extends FormComponentProps {
  sysMenu: StateType;
  dispatch: Dispatch<Action<ActionType>>;
}

type FormType = 0 | 1;

export const SysMenuType = {
  MENU: 10,
  BUTTON: 20,
};

const SysMenuComponent: React.FC<Props> = ({sysMenu, dispatch, form}) => {

  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [infoModal, setInfoModal] = useState({
    visible: false,
    loading: false,
    commitAble: false,
  });
  const [formType, setFormType] = useState(0 as FormType);
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
    const values = {
      title: formValues.title,
      type: formValues.type,
    };
    if (formValues.type === SysMenuType.MENU) {
      values['url'] = formValues.url;
      values['icon'] = formValues.icon;
      values['hide'] = formValues.hide;
    } else if (formValues.type === SysMenuType.BUTTON) {
      values['authority'] = formValues.authority;
    }
    form.setFieldsValue(values);
  }, [formValues.id]);

  const onClickNode = ([id]: string[]) => {
    if (id !== undefined) {
      setFormType(1);
      setSelectedId(id);
      setInfoModal({...infoModal, visible: true, loading: true});
      dispatch({
        type: 'sysMenu/queryMenuInfo',
        payload: id,
        callback: function () {
          setInfoModal({...infoModal, visible: true, loading: false});
        }
      });
    } else {
      setFormType(0);
      form.resetFields();
      form.setFieldsValue({
        type: SysMenuType.MENU,
      });
      dispatch({
        type: 'sysMenu/saveFormValues',
        payload: {
          type: SysMenuType.MENU,
        }
      });
      setSelectedId(undefined);
    }
  };

  // 删除
  const handleDelete = () => {
    Modal.confirm({
      title: '提示',
      content: '确认删除吗？这会其下所有节点',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        setLoading(true);
        setInfoModal({
          ...infoModal,
          loading: true,
        });
        setFormType(0);
        dispatch({
          type: 'sysMenu/delete',
          payload: selectedId,
          callback: () => {
            setLoading(false);
            form.resetFields();
            form.setFieldsValue({
              type: SysMenuType.MENU,
            });
            setInfoModal({
              ...infoModal,
              loading: false,
            });
          },
        });
      },
    });
  };
  // 保存
  const handleSave = () => {
    form.validateFields((err, values: SysMenu) => {
      if (err) {
        return;
      }
      setInfoModal({
        ...infoModal,
        loading: true
      });
      values.hide = formValues.hide;
      if (formType === 0) {
        // 新增
        values.parentId = selectedId;
        dispatch({
          type: 'sysMenu/insert',
          payload: values,
          callback: (id: string) => {
            setInfoModal({
              ...infoModal,
              loading: false,
              visible: false,
            });
            message.success('添加成功！');
          }
        });
      } else if (formType === 1) {
        // 修改
        values.id = selectedId;
        dispatch({
          type: 'sysMenu/update',
          payload: values,
          callback: () => {
            dispatch({
              type: 'sysMenu/updateOneTreeNode',
              payload: {
                id: selectedId,
                label: values.title,
              },
            });
            setInfoModal({
              ...infoModal,
              loading: false,
              visible: false,
            });
            message.success('修改成功！');
          }
        });
      }
    });
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
          rules: [{required: true, message: '菜单名称不能为空且最长为16个字符！', max: 16}],
        })(
          <Input/>
        )}
      </Form.Item>
      <Form.Item label="菜单类型" labelCol={{span: 5}} wrapperCol={{span: 19}}>
        {form.getFieldDecorator('type', {
          rules: [{required: true, message: '菜单类型必填！',}],
        })(
          <Radio.Group onChange={e => {
            const value = e.target.value;
            dispatch({
              type: 'sysMenu/saveFormValues',
              payload: {
                ...sysMenu.data.formValues,
                type: value,
              }
            });
          }}>
            <Radio value={SysMenuType.MENU}>菜单</Radio>
            <Radio value={SysMenuType.BUTTON}>按钮</Radio>
          </Radio.Group>
        )}
      </Form.Item>
      {
        formValues.type === 10 ? (
          <>
            <Form.Item label="页面路径" labelCol={{span: 5}} wrapperCol={{span: 19}}>
              {form.getFieldDecorator('url', {
                rules: [{required: true}],
              })(
                <Input/>
              )}
            </Form.Item>
            <Form.Item label="隐藏菜单" labelCol={{span: 5}} wrapperCol={{span: 19}}>
              {form.getFieldDecorator('hide', {
                rules: [{required: false}],
              })(
                <Checkbox checked={sysMenu.data.formValues.hide !== 0} onChange={(e) => {
                  dispatch({
                    type: 'sysMenu/saveFormValues',
                    payload: {
                      ...sysMenu.data.formValues,
                      hide: e.target.checked ? 1 : 0,
                    }
                  });
                }} />
              )}
            </Form.Item>
            <Form.Item label="图标" labelCol={{span: 5}} wrapperCol={{span: 19}}>
              {form.getFieldDecorator('icon', {
                rules: [],
              })(
                <Input/>
              )}
            </Form.Item>
          </>
        ) : (
          <Form.Item label="权限标识" labelCol={{span: 5}} wrapperCol={{span: 19}}>
            {form.getFieldDecorator('authority', {
              rules: [{required: true}],
            })(
              <Input/>
            )}
          </Form.Item>
        )
      }
      {checkBreakPoint(['xs', 'sm'], size.width) ? <></> :
        <AuthorityChecker withAuthority="ROLE_super">
          <Form.Item labelCol={{span: 5}} wrapperCol={{span: 19, push: 5}}>
            <Button type="primary" onClick={e => {
              e.preventDefault();
              handleSave();
            }}>
              {
                formType === 0 ? '新增' : '修改'
              }
            </Button>

          </Form.Item>
        </AuthorityChecker>
      }
    </Spin>
  );

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <div style={{marginBottom: '16px'}}>
          <AuthorityChecker withAuthority="ROLE_super" resultCallback={(result:boolean) => {
            if (result !== infoModal.commitAble) {
              setInfoModal({
                ...infoModal,
                commitAble: result,
              });
            }
          }}>
            <Button
              icon="plus"
              type="primary"
              style={{marginRight: '8px'}}
              onClick={() => {
                setFormType(0);
                setInfoModal({
                  ...infoModal,
                  visible: true,
                });
                form.resetFields();
                form.setFieldsValue({
                  type: SysMenuType.MENU,
                });
                dispatch({
                  type: 'sysMenu/saveFormValues',
                  payload: {
                    type: SysMenuType.MENU,
                  }
                });
              }}
            >
              新建
            </Button>
            {
              selectedId &&
              <Button onClick={handleDelete}>
                删除
              </Button>
            }
          </AuthorityChecker>
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
              <Modal okButtonProps={{disabled: infoModal.loading || !infoModal.commitAble}} visible={infoModal.visible}
                     title="菜单信息"
                     onCancel={() => setInfoModal({...infoModal, visible: false})}
                     onOk={(e) => {
                       e.preventDefault();
                       handleSave();
                     }}
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
