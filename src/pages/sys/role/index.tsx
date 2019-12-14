import {Alert, Button, Card, Col, Divider, Form, Input, message, Modal, Popconfirm, Row, Select, Table} from "antd";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import React, {Fragment, useEffect, useState} from "react";
import {FormComponentProps} from "antd/es/form";
import {connect} from "dva";
import SearchForm from "@/viit/components/table/SearchForm";
import VTContainer from "@/viit/components/table/VTContainer";
import MenuBar from "@/viit/components/table/MenuBar";
import SubmitButtons from "@/viit/components/table/SubmitButtons";
import TableContainer from "@/viit/components/table/TableContainer";
import TableInfo from "@/viit/components/table/TableInfo";
import {ColumnProps, PaginationConfig} from "antd/es/table";
import {StateType} from "./model";
import {SysRole, SysRoleForm} from "./data";
import {Action, Dispatch} from "redux";
import CreateForm from "./components/CreateForm";
import UpdateForm from "./components/UpdateForm";
import {HttpResponse} from "@/viit/model/types";
import {SysRoleType} from "@/pages/sys/roleType/data";
import AssignAuthorityModal from "@/pages/sys/role/components/AssignAuthorityModal";

const FormItem = Form.Item;

type ActionType =
  'sysRole/fetch' |
  'sysRole/insert' |
  'sysRole/delete' |
  'sysRole/get' |
  'sysRole/update'|
  'sysRole/fetchRoleTypes' |
  'sysRole/fetchMenuTree';

interface Props extends FormComponentProps {
  dispatch: Dispatch<Action<ActionType>>;
  sysRole: StateType
}

interface TableColumnProps extends ColumnProps<SysRole> {
}

const sysRoleComponent: React.FC<Props> = ({form, dispatch, sysRole}) => {

  const {getFieldDecorator} = form;

  // 搜索表单
  const [searchFormFields, setSearchFormFields] = useState({});
  // 分页信息
  const [pageInfo, setPageInfo] = useState({
    current: 1,
    pageSize: 10,
  });
  // 选中行
  const rolKeys: string[] | number[] = [];
  const [selectedRowKeys, setSelectedRowKeys] = useState(rolKeys);
  // 加载
  const [loading, setLoading] = useState(false);

  // modal信息
  interface ModalState {
    loading: boolean;
    visible: boolean;
  }

  const [createModalInfo, setCreateModalInfo] = useState({
    loading: false,
    visible: false,
  } as ModalState);

  interface UpdateModalState extends ModalState {
    fields: SysRole;
  }
  const [updateModalInfo, setUpdateModalInfo] = useState({
    loading: false,
    visible: false,
    fields: {},
  } as UpdateModalState);

  interface AuthorityState {
    visible: boolean;
    record: SysRole | {};
    loading: boolean;
  }
  const [assignModalState, setAssignModalState] = useState({
    visible: false,
    record: {},
    loading: false,
  } as AuthorityState);

  // 初始化数据
  useEffect(() => {
    setLoading(true);
    dispatch({
      type: 'sysRole/fetch',
      payload: {
        page: {
          ...pageInfo,
        }
      },
      callback: () => {
        setLoading(false);
      }
    });
    dispatch({
      type: 'sysRole/fetchRoleTypes'
    });
    dispatch({
      type: 'sysRole/fetchMenuTree'
    });
  }, []);
  // 设置分页
  const onTableChange = (pagination: PaginationConfig) => {
    setLoading(true);
    setPageInfo({
      current: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    });
    dispatch({
      type: 'sysRole/fetch',
      payload: {
        page: {
          current: pagination.current,
          pageSize: pagination.pageSize,
        },
        fields: {...searchFormFields}
      },
      callback: () => {
        setLoading(false);
      },
    });
  };
  // 处理查询
  const handleSearchFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      setLoading(true);
      setSelectedRowKeys([]);
      setSearchFormFields({...fieldsValue});
      const newPageInfo = {
        ...pageInfo,
        current: 1,
      };
      setPageInfo(newPageInfo);
      dispatch({
        type: 'sysRole/fetch',
        payload: {
          page: {
            ...newPageInfo,
          },
          fields: {...fieldsValue}
        },
        callback: () => setLoading(false),
      });
    });
  };
  // 处理重置
  const handleReset = () => {
    setSelectedRowKeys([]);
    setSearchFormFields({});
    form.resetFields();
    const newPageInfo = {
      ...pageInfo,
      current: 1,
    };
    setLoading(true);
    setPageInfo(newPageInfo);
    dispatch({
      type: 'sysRole/fetch',
      payload: {
        page: {
          ...newPageInfo,
        }
      },
      callback: () => setLoading(false),
    });
  };
  // 新建
  const handleNewItem = () => {
    setCreateModalInfo({
      ...createModalInfo,
      visible: true,
    });
  };
  // 处理新增操作
  const handleNewItemSubmit = (fields: SysRoleForm) => {
    setCreateModalInfo({
      ...createModalInfo,
      loading: true,
    });
    dispatch({
      type: 'sysRole/insert',
      payload: fields,
      callback: () => {
        setCreateModalInfo({
          visible: false,
          loading: false,
        });
        message.success('添加成功！');
        const newPageInfo = {
          ...pageInfo,
          current: 1,
        };
        setSelectedRowKeys([]);
        setSearchFormFields({});
        setPageInfo(newPageInfo);
        form.resetFields();
        const query = {
          page: {
            ...newPageInfo,
          }
        };
        dispatch({
          type: 'sysRole/fetch',
          payload: query
        });
      }
    });
  };
  // 处理删除
  const handleDelete = (id: string | string[] | number[]) => {
    if (Array.isArray(id)) {
      id = id.join(',');
    }
    setLoading(true);
    dispatch({
      type: 'sysRole/delete',
      payload: id,
      query: {
        page: {
          ...pageInfo,
        },
        fields: {
          ...searchFormFields,
        },
      },
      callback: () => {
        message.success('删除成功！');
        setSelectedRowKeys([]);
      },
      fetchCallback: () => {
        setLoading(false);
      }
    });
  };
  // 删除多项
  const handleDeleteMany = () => {
    Modal.confirm({
      title: '提示',
      content: '确认删除吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => handleDelete(selectedRowKeys),
    });
  };
  // 处理点击修改
  const handleClickUpdate = (id: string) => {
    setUpdateModalInfo({
      ...updateModalInfo,
      visible: true,
      loading: true,
    } as UpdateModalState);
    dispatch({
      type: 'sysRole/get',
      payload: id,
      callback: (response: HttpResponse) => {
        const fieldsValue:SysRole = response.data;
        console.log(updateModalInfo);
        setUpdateModalInfo({
          visible: true,
          loading: false,
          fields: fieldsValue,
        } as UpdateModalState);
      }
    });
  };
  // 处理修改
  const handleUpdate = (fields: SysRoleForm) => {
    setUpdateModalInfo({
      ...updateModalInfo,
      loading: true,
    });
    dispatch({
      type: 'sysRole/update',
      payload: fields,
      callback: () => {
        setLoading(true);
        setUpdateModalInfo({
          visible: false,
          loading: false,
          fields: {},
        } as UpdateModalState);
        message.success('修改成功！');
      },
      queryCallback: () => {
        setLoading(false);
      }
    });
  };
  // 处理分配权限
  const assignClickAssign = (record: SysRole) => {
    setAssignModalState({
      visible: true,
      record: record,
      loading: false,
    });
  };
  const handleAssign = (id:string, menus:string[]) => {

    const newState = {
      ...assignModalState,
      loading: true,
      record: {
        ...assignModalState.record,
        menuIdList: menus,
      },
    };
    setAssignModalState(newState);
    dispatch({
      type: 'sysRole/update',
      payload: {
        id: id,
        menuIdList: menus,
      },
      callback: () => {
        setLoading(true);
        setAssignModalState({
          visible: false,
          loading: false,
          record: {},
        } as AuthorityState);
        message.success('分配成功！');
      },
      queryCallback: () => {
        setLoading(false);
      }
    });
  };
  const columns: TableColumnProps[] = [
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '角色标识',
      dataIndex: 'code',
    },
    {
      title: '角色类型',
      dataIndex: 'infoFields.typeIdText',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
    },
    {
      title: '更新时间',
      dataIndex: 'updateDate',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => {
            handleClickUpdate(record.id);
          }}>修改</a>
          <Divider type="vertical"/>
          <Popconfirm
            title="确定删除此项数据吗?"
            onConfirm={() => {
              handleDelete(record.id);
            }}
            okText="是"
            cancelText="否"
          >
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical"/>
          <a onClick={(e) => {
            e.preventDefault();
            assignClickAssign(record);
          }}>分配权限</a>
        </Fragment>
      ),
    },
  ];

  // 搜索表单
  const searchForm = (
    <SearchForm>
      <Form layout="inline" onSubmit={handleSearchFormSubmit}>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={12} lg={6} sm={24}>
            <FormItem label="角色名称">
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} lg={6} sm={24}>
            <FormItem label="角色标识">
              {getFieldDecorator('code')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={12} lg={6} sm={24}>
            <FormItem label="角色类型">
              {getFieldDecorator('typeId')(
                <Select style={{ width: '100%'}} placeholder="请选择" disabled={sysRole.data.roleTypes === undefined}>
                  {
                    (sysRole.data.roleTypes || [] as SysRoleType[]).map(it => {
                      return <Select.Option key={it.id}>{it.typeName}</Select.Option>;
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={12} lg={6} sm={24}>
            <SubmitButtons>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{marginLeft: 8}} onClick={handleReset}>
                重置
              </Button>
            </SubmitButtons>
          </Col>
        </Row>
      </Form>
    </SearchForm>
  );

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <VTContainer>
          {searchForm}
          <MenuBar>
            <Button icon="plus" type="primary" onClick={handleNewItem}>
              新建
            </Button>
            {selectedRowKeys.length > 0 &&
            <Button onClick={handleDeleteMany}>
              删除
            </Button>
            }
          </MenuBar>
          <TableContainer>
            <TableInfo>
              <Alert
                message={
                  <Fragment>
                    已选择 <a style={{fontWeight: 600}}>{selectedRowKeys.length}</a> 项
                  </Fragment>
                }
                type="info"
                showIcon
              />
            </TableInfo>
            <Table
              loading={loading}
              columns={columns}
              onChange={onTableChange}
              dataSource={sysRole.data.list}
              rowSelection={{
                onChange: (selectedRowKeys) => {
                  setSelectedRowKeys(selectedRowKeys)
                },
                selectedRowKeys: selectedRowKeys,
              }}
              pagination={{
                showQuickJumper: true,
                showSizeChanger: true,
                ...pageInfo,
                ...sysRole.data.pagination,
                showTotal: (total, range) => `第${range[0]}-${range[1]}条，共${total}条`
              }}
              rowKey="id"/>
          </TableContainer>
        </VTContainer>
        <CreateForm
          loading={createModalInfo.loading || sysRole.data.roleTypes === undefined}
          modalVisible={createModalInfo.visible}
          onCancel={() => {
            setCreateModalInfo({
              loading: false,
              visible: false,
            });
          }}
          handleSubmit={handleNewItemSubmit}
          roleTypes={sysRole.data.roleTypes}
        />
        <UpdateForm
          loading={updateModalInfo.loading || sysRole.data.roleTypes === undefined}
          modalVisible={updateModalInfo.visible}
          role={updateModalInfo.fields}
          handleSubmit={handleUpdate}
          onCancel={() => {
            setUpdateModalInfo({
              loading: false,
              visible: false,
              fields: {},
            } as UpdateModalState);
          }}
          roleTypes={sysRole.data.roleTypes}
        />
        <AssignAuthorityModal
          visible={assignModalState.visible}
          treeData={sysRole.data.menuTree}
          record={assignModalState.record}
          onCancel={() => {
            setAssignModalState({
              visible: false,
              record: {},
              loading: false,
            });
          }}
          handleAssign={handleAssign}
          loading={assignModalState.loading}
        />
      </Card>
    </PageHeaderWrapper>
  );
};
const ConnectedComponent = connect(
  ({sysRole}: { sysRole: StateType }) => ({sysRole})
)(sysRoleComponent);
export default Form.create<Props>()(ConnectedComponent);
