import React, {useEffect, useState} from 'react';
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {Button, Card, Col, Form, Input, message, Modal, Row, Select, Spin, Tree} from "antd";
import {DeptTreeItem, OrgaDept} from "./data";
import {connect} from "dva";
import {StateType} from "@/pages/sys/menu/model";
import {Action, Dispatch} from "redux";
import {checkBreakPoint} from "@/utils/viit/GridBreakPoint";
import DocumentSize from "@/utils/viit/DocumentSize";
import {FormComponentProps} from "antd/es/form";
import AuthorityChecker from "@/viit/components/auth/AuthorityChecker";
import {getDictItems} from "@/pages/sys/dictItem/service";
import {SysDictItem} from "@/pages/sys/dictItem/data";
import {saveOrder} from './service';

const {TreeNode} = Tree;

type ActionType =
  ( 'orgaDept/fetchTree'
  | 'orgaDept/queryInfo'
  | 'orgaDept/delete'
  | 'orgaDept/saveFormValues'
  | 'orgaDept/insert'
  | 'orgaDept/update'
  | 'orgaDept/updateOneTreeNode'
  | 'orgaDept/saveOrder'
  | 'orgaDept/saveTree' );

interface Props extends FormComponentProps {
  orgaDept: StateType;
  dispatch: Dispatch<Action<ActionType>>;
}

type FormType = 0 | 1;

const orgaDeptComponent: React.FC<Props> = ({orgaDept, dispatch, form}) => {

  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [infoModal, setInfoModal] = useState({
    visible: false,
    loading: false,
    commitAble: false,
  });
  const [formType, setFormType] = useState(0 as FormType);
  const [edited, setEdited] = useState(false);
  const [deptTypes, setDeptTypes] = useState([] as SysDictItem[]);
  const size = DocumentSize();
  const formValues = orgaDept.data.formValues;

  const fetchTree = () => {
    setLoading(true);
    dispatch({
      type: 'orgaDept/fetchTree',
      callback: () => {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    fetchTree();
    // 加载字典项
    getDictItems('dept_type').then(resp => {
      setDeptTypes(resp.data);
    });
  }, []);

  useEffect(() => {
    const values = {
      name: formValues.name,
      type: formValues.type,
      code: formValues.code,
    };
    form.setFieldsValue(values);
  }, [formValues.id]);

  const onClickNode = ([id]: string[]) => {
    if (id !== undefined) {
      setFormType(1);
      setSelectedId(id);
      setInfoModal({...infoModal, visible: true, loading: true});
      dispatch({
        type: 'orgaDept/queryInfo',
        payload: id,
        callback: function () {
          setInfoModal({...infoModal, visible: true, loading: false});
        }
      });
    } else {
      setFormType(0);
      form.resetFields();
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
          type: 'orgaDept/delete',
          payload: selectedId,
          callback: () => {
            setLoading(false);
            form.resetFields();
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
    form.validateFields((err, values: OrgaDept) => {
      if (err) {
        return;
      }
      setInfoModal({
        ...infoModal,
        loading: true
      });
      if (formType === 0) {
        // 新增
        values.parentId = selectedId;
        dispatch({
          type: 'orgaDept/insert',
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
          type: 'orgaDept/update',
          payload: values,
          callback: () => {
            dispatch({
              type: 'orgaDept/updateOneTreeNode',
              payload: {
                id: selectedId,
                label: values.name,
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

  const handleSaveOrder = () => {
    setLoading(true);
    saveOrder(orgaDept.data.treeData).then((resp) => {
      setLoading(false);
      setEdited(false);
      message.success('保存成功！');
    });
  };

  const renderTreeNodes: any = (data: DeptTreeItem[]) => {
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
      <Form.Item label="部门名称" labelCol={{span: 5}} wrapperCol={{span: 19}}>
        {form.getFieldDecorator('name', {
          rules: [{required: true, message: '部门名称不能为空且最长为16个字符！', max: 16}],
        })(
          <Input readOnly={!infoModal.commitAble} />
        )}
      </Form.Item>
      <Form.Item label="部门类型" labelCol={{span: 5}} wrapperCol={{span: 19}}>
        {form.getFieldDecorator('type', {
          rules: [{required: true, message: '部门类型必填'}],
        })(
          <Select style={{ width: '100%' }} placeholder="请选择">
            {
              deptTypes.map(it => (<Select.Option key={it.id} value={it.value}>{it.text}</Select.Option>))
            }
          </Select>
        )}
      </Form.Item>
      <Form.Item label="部门编码" labelCol={{span: 5}} wrapperCol={{span: 19}}>
        {form.getFieldDecorator('code')(
          <Input readOnly={!infoModal.commitAble} autoComplete="off" />
        )}
      </Form.Item>
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
              disabled={loading}
              onClick={() => {
                setFormType(0);
                setInfoModal({
                  ...infoModal,
                  visible: true,
                });
                form.resetFields();
              }}
            >
              新建
            </Button>
            {
              selectedId &&
              <Button onClick={handleDelete} style={{ marginRight: '8px'}}>
                删除
              </Button>
            }
            {
              edited &&
              <Button onClick={handleSaveOrder} disabled={loading}>
                保存排序
              </Button>
            }
          </AuthorityChecker>
        </div>
        <Row>
          <Col xl={6} sm={8} xxl={6} md={8} xs={24}>
            <Spin spinning={loading}>
              <Tree draggable={infoModal.commitAble} onSelect={onClickNode} onDrop={(e) => {
                setEdited(true);
                dispatch({
                  type: 'orgaDept/saveOrder',
                  payload: {
                    dragNodeId: e.dragNode.props.eventKey,
                    nodeId: e.node.props.eventKey,
                    pos: e.dropPosition,
                    dropToGap: e.dropToGap,
                  }
                });
              }}>
                {renderTreeNodes(orgaDept.data.treeData)}
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
const formFC = Form.create<Props>()(orgaDeptComponent);
export default connect(({orgaDept}: { orgaDept: StateType }) => {
  return {orgaDept};
})(formFC);
