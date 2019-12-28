import {Alert, Button, Card, Col, Divider, Form, Input, message, Modal, Popconfirm, Row, Table} from "antd";
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
import {ProcessModel, ProcessModelForm} from "./data";
import {Action, Dispatch} from "redux";
import CreateForm from "./components/CreateForm";
import UpdateForm from "./components/UpdateForm";
import {HttpResponse} from "@/viit/model/types";
import AuthorityChecker from "@/viit/components/auth/AuthorityChecker";
import AuthorityContainer from "@/viit/components/auth/AuthorityContainer";
import router from "umi/router";
import {deploy} from "@/pages/bpmf/model/service";

const FormItem = Form.Item;

type ActionType =
  'processModel/fetch' |
  'processModel/insert' |
  'processModel/delete' |
  'processModel/get' |
  'processModel/update' |
  'processModel/setPagination';

interface Props extends FormComponentProps {
  dispatch: Dispatch<Action<ActionType>>;
  processModel: StateType
}

interface TableColumnProps extends ColumnProps<ProcessModel> {
}

const ProcessModelComponent: React.FC<Props> = ({form, dispatch, processModel}) => {

  const {getFieldDecorator} = form;

  // 搜索表单
  const [searchFormFields, setSearchFormFields] = useState({});
  // 分页信息
  // const [pageInfo, setPageInfo] = useState({
  //   current: 1,
  //   pageSize: 10,
  // });
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
    fields: ProcessModel;
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
      type: 'processModel/fetch',
      payload: {
        page: {
          ...processModel.data.pagination,
        }
      },
      callback: () => {
        setLoading(false);
      }
    });
  }, []);
  // 设置分页
  const onTableChange = (pagination: PaginationConfig) => {
    setLoading(true);
    dispatch({
      type: 'processModel/setPagination',
      payload: {
        current: pagination.current || 1,
        pageSize: pagination.pageSize || 10,
      }
    });
    dispatch({
      type: 'processModel/fetch',
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
      dispatch({
        type: 'processModel/setPagination',
        payload: {
          current: 1,
        }
      });
      dispatch({
        type: 'processModel/fetch',
        payload: {
          page: {
            ...processModel.data.pagination,
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
      ...processModel.data.pagination,
      current: 1,
    };
    setLoading(true);
    dispatch({
      type: 'processModel/setPagination',
      payload: newPageInfo,
    });
    dispatch({
      type: 'processModel/fetch',
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
  const handleNewItemSubmit = (fields: ProcessModelForm) => {
    setCreateModalInfo({
      ...createModalInfo,
      loading: true,
    });
    dispatch({
      type: 'processModel/insert',
      payload: fields,
      callback: () => {
        setCreateModalInfo({
          visible: false,
          loading: false,
        });
        message.success('添加成功！');
        const newPageInfo = {
          ...processModel.data.pagination,
          current: 1,
        };
        setSelectedRowKeys([]);
        setSearchFormFields({});
        dispatch({
          type: 'processModel/setPagination',
          payload: newPageInfo,
        });
        const query = {
          page: {
            ...newPageInfo,
          }
        };
        dispatch({
          type: 'processModel/fetch',
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
      type: 'processModel/delete',
      payload: id,
      query: {
        page: {
          ...processModel.data.pagination,
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
      type: 'processModel/get',
      payload: id,
      callback: (response: HttpResponse) => {
        const fieldsValue: ProcessModel = response.data;
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
  const handleUpdate = (fields: ProcessModelForm) => {
    setUpdateModalInfo({
      ...updateModalInfo,
      loading: true,
    });
    dispatch({
      type: 'processModel/update',
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
  const handleDeploy = (id: string) => {
    setLoading(true);
    deploy(id).then(resp => {
      setLoading(false);
      message.success('部署成功！');
    });
  };
  const columns: TableColumnProps[] = [
    {
      title: '流程名称',
      dataIndex: 'name',
    },
    {
      title: '流程标识',
      dataIndex: 'key',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '更新时间',
      dataIndex: 'lastUpdateTime',
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
              <Divider type="vertical"/>
            </AuthorityChecker>
            <AuthorityChecker withAuthority="sys:dict:update">
              <a onClick={() => {
                router.push(`/bpmf/editor/${record.id}`);
              }}>设计流程</a>
              <Divider type="vertical"/>
            </AuthorityChecker>
            <a onClick={e=>{
              e.preventDefault();
              handleDeploy(record.id);
            }}>部署</a>
          </AuthorityContainer>
        </Fragment>
      ),
    },
  ];

  // 搜索表单
  const searchForm = (
    <SearchForm>
      <Form layout="inline" onSubmit={handleSearchFormSubmit}>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="字典名称">
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="字典标识">
              {getFieldDecorator('code')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
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
            <AuthorityChecker withAuthority="sys:dict:add">
              <Button icon="plus" type="primary" onClick={handleNewItem}>
                新建
              </Button>
            </AuthorityChecker>
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
              loading={loading}
              columns={columns}
              onChange={onTableChange}
              dataSource={processModel.data.list}
              rowSelection={{
                onChange: (selectedRowKeys) => {
                  setSelectedRowKeys(selectedRowKeys)
                },
                selectedRowKeys: selectedRowKeys,
              }}
              pagination={{
                showQuickJumper: true,
                showSizeChanger: true,
                ...processModel.data.pagination,
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
          record={updateModalInfo.fields}
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
  ({processModel}: { processModel: StateType }) => ({processModel})
)(ProcessModelComponent);
export default Form.create<Props>()(ConnectedComponent);
