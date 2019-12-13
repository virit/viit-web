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
import {SysRoleType, SysRoleTypeForm} from "@/pages/sys/roleType/data";
import {Action, Dispatch} from "redux";
import CreateForm from "./components/CreateForm";

const FormItem = Form.Item;

type ActionType = 'sysRoleType/fetch' | 'sysRoleType/insert' | 'sysRoleType/delete';

interface Props extends FormComponentProps {
  dispatch: Dispatch<Action<ActionType>>;
  sysRoleType: StateType
}

interface TableColumnProps extends ColumnProps<SysRoleType> {
}

const SysRoleTypeComponent: React.FC<Props> = ({form, dispatch, sysRoleType}) => {

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
  interface ModelState {
    loading: boolean;
    visible: boolean;
  }

  const [createModalInfo, setCreateModalInfo] = useState({
    loading: false,
    visible: false
  } as ModelState);

  // 初始化数据
  useEffect(() => {
    setLoading(true);
    dispatch({
      type: 'sysRoleType/fetch',
      payload: {
        page: {
          ...pageInfo,
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
    setPageInfo({
      current: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    });
    dispatch({
      type: 'sysRoleType/fetch',
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
        type: 'sysRoleType/fetch',
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
      type: 'sysRoleType/fetch',
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
  const handleNewItemSubmit = (fields: SysRoleTypeForm) => {
    setCreateModalInfo({
      ...createModalInfo,
      loading: true,
    });
    dispatch({
      type: 'sysRoleType/insert',
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
        const query = {
          page: {
            ...newPageInfo,
          }
        };
        dispatch({
          type: 'sysRoleType/fetch',
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
      type: 'sysRoleType/delete',
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
  const columns: TableColumnProps[] = [
    {
      title: '类型名称',
      dataIndex: 'typeName',
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
            <FormItem label="类型名称">
              {getFieldDecorator('typeName')(<Input placeholder="请输入"/>)}
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
              dataSource={sysRoleType.data.list}
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
                ...sysRoleType.data.pagination,
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
      </Card>
    </PageHeaderWrapper>
  );
};
const ConnectedComponent = connect(
  ({sysRoleType}: { sysRoleType: StateType }) => ({sysRoleType})
)(SysRoleTypeComponent);
export default Form.create<Props>()(ConnectedComponent);
