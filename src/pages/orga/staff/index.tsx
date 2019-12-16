import React from "react";
import {PageHeaderWrapper} from "@ant-design/pro-layout";
import {Card} from "antd";

interface Props {
}

const Staff:React.FC<Props> = () => {

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
      </Card>
    </PageHeaderWrapper>
  );
};
export default Staff;
