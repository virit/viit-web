import {Alert, Button, Card, Divider, Form, message, Modal, Popconfirm, Table} from "antd";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import React, {Fragment, useEffect, useState} from "react";
import {FormComponentProps} from "antd/es/form";
import {connect} from "dva";
import VTContainer from "@/viit/components/table/VTContainer";
import MenuBar from "@/viit/components/table/MenuBar";
import TableContainer from "@/viit/components/table/TableContainer";
import TableInfo from "@/viit/components/table/TableInfo";
import {ColumnProps, PaginationConfig} from "antd/es/table";
import {StateType} from "./model";
import {SysDictItem, SysDictItemForm} from "./data";
import {Action, Dispatch} from "redux";
import CreateForm from "./components/CreateForm";
import UpdateForm from "./components/UpdateForm";
import {HttpResponse} from "@/viit/model/types";
import AuthorityChecker from "@/viit/components/auth/AuthorityChecker";
import AuthorityContainer from "@/viit/components/auth/AuthorityContainer";

type ActionType =
  'sysDictItem/fetch' |
  'sysDictItem/insert' |
  'sysDictItem/delete' |
  'sysDictItem/get' |
  'sysDictItem/update';

interface Props extends FormComponentProps {
  dispatch: Dispatch<Action<ActionType>>;
  sysDictItem: StateType;
  match: {
    params: {
      id: string;
    };
  };
}

interface TableColumnProps extends ColumnProps<SysDictItem> {
}

const SysDictItemComponent: React.FC<Props> = ({form, dispatch, sysDictItem, match}) => {

  const dictId = match.params.id;

  // 搜索表单
  const [searchFormFields, setSearchFormFields] = useState({});
  useEffect(() => {
    setSearchFormFields({
      ...searchFormFields,
      dictId,
    });
  }, []);
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
    fields: SysDictItem;
  }

  const [updateModalInfo, setUpdateModalInfo] = useState({
    loading: false,
    visible: false,
    fields: {},
  } as UpdateModalState);

  // 初始化数据
  useEffect(() => {
    setLoading(true);
    dispatch({
      type: 'sysDictItem/fetch',
      payload: {
        page: {
          ...pageInfo,
        },
        fields: {
          dictId: dictId,
        },
      },
      callback: () => {
        setLoading(false);
      }
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
      type: 'sysDictItem/fetch',
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
  // 新建
  const handleNewItem = () => {
    setCreateModalInfo({
      ...createModalInfo,
      visible: true,
    });
  };
  // 处理新增操作
  const handleNewItemSubmit = (fields: SysDictItemForm) => {
    fields.dictId = dictId;
    setCreateModalInfo({
      ...createModalInfo,
      loading: true,
    });
    dispatch({
      type: 'sysDictItem/insert',
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
        setSearchFormFields({
          dictId,
        });
        setPageInfo(newPageInfo);
        const query = {
          page: {
            ...newPageInfo,
          },
          fields: {
            dictId,
          }
        };
        dispatch({
          type: 'sysDictItem/fetch',
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
      type: 'sysDictItem/delete',
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
      type: 'sysDictItem/get',
      payload: id,
      callback: (response: HttpResponse) => {
        const fieldsValue: SysDictItem = response.data;
        setUpdateModalInfo({
          visible: true,
          loading: false,
          fields: fieldsValue,
        } as UpdateModalState);
      }
    });
  };
  // 处理修改
  const handleUpdate = (fields: SysDictItemForm) => {
    setUpdateModalInfo({
      ...updateModalInfo,
      loading: true,
    });
    fields.dictId = dictId;
    dispatch({
      type: 'sysDictItem/update',
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
  const columns: TableColumnProps[] = [
    {
      title: '文本',
      dataIndex: 'text',
    },
    {
      title: '值',
      dataIndex: 'value',
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <AuthorityContainer>
            <AuthorityChecker withAuthority="sys:dict:update">
              <a onClick={() => {
                handleClickUpdate(record.id);
              }}>修改</a>
              <Divider type="vertical"/>
            </AuthorityChecker>
            <AuthorityChecker withAuthority="sys:dict:delete">
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
            </AuthorityChecker>
          </AuthorityContainer>
        </Fragment>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <VTContainer>
          <MenuBar>
            <AuthorityChecker withAuthority="sys:dict:add">
              <Button icon="plus" type="primary" onClick={handleNewItem}>
                新建
              </Button>
            </AuthorityChecker>
            <Button onClick={() => {
              history.go(-1);
            }}>
              返回
            </Button>
            <AuthorityChecker withAuthority="sys:dict:delete">
              {selectedRowKeys.length > 0 &&
              <Button onClick={handleDeleteMany}>
                删除
              </Button>
              }
            </AuthorityChecker>
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
              size="middle"
              loading={loading}
              columns={columns}
              onChange={onTableChange}
              dataSource={sysDictItem.data.list}
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
                ...sysDictItem.data.pagination,
                showTotal: (total, range) => `第${range[0]}-${range[1]}条，共${total}条`
              }}
              rowKey="id"/>
          </TableContainer>
        </VTContainer>
        <CreateForm
          loading={createModalInfo.loading}
          modalVisible={createModalInfo.visible}
          onCancel={() => {
            setCreateModalInfo({
              loading: false,
              visible: false,
            });
          }}
          handleSubmit={handleNewItemSubmit}
        />
        <UpdateForm
          loading={updateModalInfo.loading}
          modalVisible={updateModalInfo.visible}
          dictItem={updateModalInfo.fields}
          handleSubmit={handleUpdate}
          onCancel={() => {
            setUpdateModalInfo({
              loading: false,
              visible: false,
              fields: {},
            } as UpdateModalState);
          }}
        />
      </Card>
    </PageHeaderWrapper>
  );
};
const ConnectedComponent = connect(
  ({sysDictItem}: { sysDictItem: StateType }) => ({sysDictItem})
)(SysDictItemComponent);
export default Form.create<Props>()(ConnectedComponent);
