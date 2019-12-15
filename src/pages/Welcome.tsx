import React from 'react';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import {Alert, Card} from 'antd';

export default (): React.ReactNode => (
  <PageHeaderWrapper>
    <Card>
      <Alert
        message="欢迎登录"
        type="success"
        showIcon
        banner
        style={{
          margin: -12,
          marginBottom: 24,
        }}
      />
    </Card>
  </PageHeaderWrapper>
);
