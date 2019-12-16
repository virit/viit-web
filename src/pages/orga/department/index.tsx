import React from "react";
import {Card} from "antd";
import {PageHeaderWrapper} from "@ant-design/pro-layout";

interface Props {
}

const Department:React.FC<Props> = () => {

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
      </Card>
    </PageHeaderWrapper>
  );
};
export default Department;
