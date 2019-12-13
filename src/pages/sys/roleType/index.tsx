import {Alert, Button, Card, Col, Form, Input, Row, Table} from "antd";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import React, {Fragment} from "react";
import {FormComponentProps} from "antd/es/form";
import {connect} from "dva";
import {StateType} from "@/pages/sys/menu/model";
import SearchForm from "@/viit/components/table/SearchForm";
import VTContainer from "@/viit/components/table/VTContainer";
import MenuBar from "@/viit/components/table/MenuBar";
import SubmitButtons from "@/viit/components/table/SubmitButtons";
import TableContainer from "@/viit/components/table/TableContainer";
import TableInfo from "@/viit/components/table/TableInfo";
import {ColumnProps} from "antd/es/table";

const FormItem = Form.Item;

interface Props extends FormComponentProps {
}

interface TableColumnProps extends ColumnProps<SysRoleType>{
}

const columns: TableColumnProps[] = [
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
];

const SysRoleTypeComponent: React.FC<Props> = ({form}) => {

  const {getFieldDecorator} = form;

  // 搜索表单
  const searchForm = (
    <SearchForm>
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('username')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <SubmitButtons>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }}>
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
            <Button icon="plus" type="primary">
              新建
            </Button>
            <Button>
              删除
            </Button>
          </MenuBar>
          <TableContainer>
            <TableInfo>
              <Alert
                message={
                  <Fragment>
                    已选择 <a style={{ fontWeight: 600 }}>0 项</a>
                  </Fragment>
                }
                type="info"
                showIcon
              />
            </TableInfo>
            <Table columns={columns}/>
          </TableContainer>
        </VTContainer>
      </Card>
    </PageHeaderWrapper>
  );
};
const FormComponent = Form.create<Props>()(SysRoleTypeComponent);
export default connect(
  ({sysRoleType}: { sysRoleType: StateType }) => ({sysRoleType})
)(FormComponent);
