import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Icon,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Tag,
} from 'antd';
import React, {Component, Fragment} from 'react';

import {Action, Dispatch} from 'redux';
import {FormComponentProps} from 'antd/es/form';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {SorterResult} from 'antd/es/table';
import {connect} from 'dva';
import {StateType} from './model';
import CreateForm from './components/CreateForm';
import StandardTable, {StandardTableColumnProps} from './components/StandardTable';
import UpdateForm from './components/UpdateForm';
import {SysUser, TableListPagination, TablePageQuery} from './data.d';

import styles from './style.less';
import {queryUserDetails} from "@/pages/sys/user/service";
import AuthorityChecker from "@/viit/components/auth/AuthorityChecker";
import {WrappedFormUtils} from "antd/lib/form/Form";
import {SysUserResultCode} from "@/pages/sys/user/resultcode";
import AuthorityContainer from "@/viit/components/auth/AuthorityContainer";

const FormItem = Form.Item;
const {Option} = Select;
const {confirm} = Modal;
// const getValue = (obj: { [x: string]: string[] }) =>
//   Object.keys(obj)
//     .map(key => obj[key])
//     .join(',');

interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<Action<| 'sysUser/add'
    | 'sysUser/fetch'
    | 'sysUser/remove'
    | 'sysUser/update'
    | 'sysUser/setPageSize'
    | 'sysUser/setCurrent'
    | 'sysUser/fetchRoles'
    | 'sysUser/setPagination'>>;
  loading: boolean;
  sysUser: StateType;
}

interface TableListState {
  modalVisible: boolean;
  createModalLoading: boolean;
  updateModalVisible: boolean;
  updateModalLoading: boolean;
  expandForm: boolean;
  selectedRows: SysUser[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<SysUser>;
  current: number;
}

type IStatusMap = 0 | 1;
const status = ['禁用', '启用',];

/* eslint react/no-multi-comp:0 */
@connect(
  ({
     sysUser,
     loading,
   }: {
    sysUser: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    sysUser,
    loading: loading.models.sysUser,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    createModalLoading: false,
    updateModalVisible: false,
    updateModalLoading: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    current: 1,
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '用户名',
      dataIndex: 'username',
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
      title: '状态',
      dataIndex: 'status',
      render(val: IStatusMap) {
        return <Tag color={val === 1 ? 'green' : 'red'}>{status[val]}</Tag>;
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <AuthorityContainer>
            <AuthorityChecker withAuthority="sys:user:update">
              <a onClick={() => this.showUpdateModal(true, record)}>修改</a>
              <Divider type="vertical"/>
            </AuthorityChecker>
            <AuthorityChecker withAuthority="sys:user:delete">
              <Popconfirm
                title="确定删除此用户吗?"
                onConfirm={() => {
                  this.handleRemove(record.id);
                }}
                okText="是"
                cancelText="否"
              >
                <a>删除</a>
              </Popconfirm>
              <Divider type="vertical"/>
            </AuthorityChecker>
            <AuthorityChecker withAuthority="sys:user:update">
              <a onClick={() => this.setUserStatus(record)}>{record.status === 1 ? '禁用' : '启用'}</a>
            </AuthorityChecker>
          </AuthorityContainer>
        </Fragment>
      ),
    },
  ];

  setUserStatus(record: SysUser) {
    const {dispatch} = this.props;
    dispatch({
      type: 'sysUser/update',
      payload: {
        id: record.id,
        status: record.status === 0 ? 1 : 0,
      },
      callback: () => this.reload(),
    });
  }

  componentDidMount() {
    const {dispatch} = this.props;
    const query: TablePageQuery = {
      page: {
        size: 10,
        current: 1,
      },
      fields: {},
    };
    dispatch({
      type: 'sysUser/fetch',
      payload: query,
    });
    dispatch({
      type: 'sysUser/fetchRoles',
    });
  }

  handleRemove(id: string) {
    const {dispatch, sysUser} = this.props;
    const {formValues} = this.state;
    const {data: {pagination}} = sysUser;

    dispatch({
      type: 'sysUser/remove',
      payload: id,
      callback() {

        const params: Partial<TablePageQuery> = {
          page: {
            current: pagination.current,
            size: pagination.pageSize,
          },
          fields: {
            ...formValues,
          },
        };
        dispatch({
          type: 'sysUser/fetch',
          payload: params,
        });
      }
    });
  }

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof SysUser, string[]>,
    sorter: SorterResult<SysUser>,
  ) => {
    const {dispatch} = this.props;
    const {formValues} = this.state;

    this.setState({
      selectedRows: []
    });

    // const filters = Object.keys(filtersArg).reduce((obj, key) => {
    //   const newObj = { ...obj };
    //   newObj[key] = getValue(filtersArg[key]);
    //   return newObj;
    // }, {});

    const params: Partial<TablePageQuery> = {
      page: {
        current: pagination.current,
        size: pagination.pageSize,
      },
      fields: {
        ...formValues,
      },
    };
    dispatch({
      type: 'sysUser/setPagination',
      payload: {
        current: pagination.current,
        size: pagination.pageSize,
      }
    });
    if (sorter.field) {
      // params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'sysUser/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const {form, dispatch} = this.props;
    this.setState({
      selectedRows: []
    });
    form.resetFields();
    dispatch({
      type: 'sysUser/setCurrent',
      payload: 1,
    });
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'sysUser/fetch',
      payload: {},
    });
  };

  reload = () => {
    const {dispatch, sysUser} = this.props;
    const {formValues} = this.state;
    const {pagination} = sysUser.data;
    console.log(sysUser);
    dispatch({
      type: 'sysUser/fetch',
      payload: {
        fields: {
          ...formValues
        },
        page: {
          ...pagination
        }
      },
    });
  };

  toggleForm = () => {
    const {expandForm} = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleRemoveItem = () => {
    const {dispatch} = this.props;
    const {selectedRows} = this.state;

    if (!selectedRows) return;
    const handleFormReset = this.handleFormReset;
    const resetRows = () => this.setState({selectedRows: []});
    confirm({
      title: '确定删除这些用户吗?',
      content: '操作后无法撤销',
      okText: "确定",
      cancelText: "取消",
      onOk() {
        dispatch({
          type: 'sysUser/remove',
          payload: selectedRows.map(row => row.key).join(','),
          callback: () => {
            resetRows();
            handleFormReset();
          },
        });
      },
    });
  };

  handleSelectRows = (rows: SysUser[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const {dispatch, form} = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      this.setState({
        selectedRows: []
      });
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'sysUser/setCurrent',
        payload: 1,
      });

      const query: TablePageQuery = {
        page: {
          size: 10,
          current: 1,
        },
        fields: {
          ...fieldsValue,
        },
      };

      dispatch({
        type: 'sysUser/fetch',
        payload: query,
      });
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  showUpdateModal = (flag: boolean, record: SysUser) => {

    this.setState({updateModalLoading: true});
    this.handleUpdateModalVisible(flag);

    const loadCallback = (resp: any) => {
      this.setState({
        stepFormValues: resp.data,
      });
      this.setState({updateModalLoading: false});
    };
    queryUserDetails(record.id).then(loadCallback);
  };

  handleUpdateModalVisible = (flag?: boolean) => {
    this.setState({
      updateModalVisible: !!flag,
    });
  };

  handleAdd = (fields: any, form: WrappedFormUtils<any>) => {
    const {dispatch} = this.props;
    this.setState({createModalLoading: true});
    dispatch({
      type: 'sysUser/add',
      payload: {
        ...fields,
      },
      callback: ({code}: any) => {
        if (code === SysUserResultCode.USERNAME_EXISTENCE) {
          message.error('用户名已存在，请重新输入');
        } else {
          message.success('添加成功');
          this.handleModalVisible();
          form.resetFields();
          this.handleFormReset();
        }
        this.setState({createModalLoading: false});
      }
    });
  };

  handleUpdate = (fields: SysUser, form: WrappedFormUtils<any>) => {
    const {dispatch, sysUser} = this.props;
    console.log(sysUser);
    this.setState({updateModalLoading: true});
    dispatch({
      type: 'sysUser/update',
      payload: {
        ...fields,
      },
      callback: ({code}: any) => {
        if (code === SysUserResultCode.USERNAME_EXISTENCE) {
          message.error('用户名已存在，请重新输入');
        } else {
          form.resetFields();
          this.reload();
          this.handleUpdateModalVisible();
          message.success('修改成功');
        }
        this.setState({updateModalLoading: false});
      },
    });
  };

  renderSimpleForm() {
    const {form} = this.props;
    const {getFieldDecorator} = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('username')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: {getFieldDecorator},
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number')(<InputNumber style={{width: '100%'}}/>)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{md: 8, lg: 24, xl: 48}}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                // @ts-ignore
                <DatePicker style={{width: '100%'}} placeholder="请输入更新日期"/>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4')(
                <Select placeholder="请选择" style={{width: '100%'}}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{overflow: 'hidden'}}>
          <div style={{float: 'right', marginBottom: 24}}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{marginLeft: 8}} onClick={this.toggleForm}>
              收起 <Icon type="up"/>
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const {expandForm} = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      sysUser: {data, data: {roles}},
      loading,
    } = this.props;

    const {selectedRows, modalVisible, updateModalVisible, stepFormValues, updateModalLoading, createModalLoading} = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <AuthorityChecker withAuthority="sys:user:add">
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建
                </Button>
              </AuthorityChecker>
              {selectedRows.length > 0 && (
                <AuthorityChecker withAuthority="sys:user:delete">
                  <Button onClick={() => this.handleRemoveItem()}>删除</Button>
                </AuthorityChecker>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} roles={roles} loading={createModalLoading}/>
        <UpdateForm  {...updateMethods} modalVisible={updateModalVisible} roles={roles} user={stepFormValues}
                     loading={updateModalLoading}/>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
