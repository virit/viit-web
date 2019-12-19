import { List, Switch } from 'antd';
import React, { Component, Fragment } from 'react';

type Unpacked<T> = T extends (infer U)[] ? U : T;

class NotificationView extends Component {
  getData = () => {
    const Action = (
      <Switch
        checkedChildren="myandaccountsettings.settings.open"
        unCheckedChildren="myandaccountsettings.settings.close"
        defaultChecked
      />
    );
    return [
      {
        title: 'myandaccountsettings.notification.password',
        description: 'myandaccountsettings.notification.password-description',
        actions: [Action],
      },
      {
        title: 'myandaccountsettings.notification.messages',
        description: 'myandaccountsettings.notification.messages-description',
        actions: [Action],
      },
      {
        title: 'myandaccountsettings.notification.todo',
        description: 'myandaccountsettings.notification.todo-description',
        actions: [Action],
      },
    ];
  };

  render() {
    const data = this.getData();
    return (
      <Fragment>
        <List<Unpacked<typeof data>>
          itemLayout="horizontal"
          dataSource={data}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
      </Fragment>
    );
  }
}

export default NotificationView;
