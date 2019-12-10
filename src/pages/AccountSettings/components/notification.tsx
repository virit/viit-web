import { List, Switch } from 'antd';
import React, { Component, Fragment } from 'react';

type Unpacked<T> = T extends (infer U)[] ? U : T;

class NotificationView extends Component {
  getData = () => {
    const Action = (
      <Switch
        checkedChildren="accountsettings.settings.open"
        unCheckedChildren="accountsettings.settings.close"
        defaultChecked
      />
    );
    return [
      {
        title: 'accountsettings.notification.password',
        description: 'accountsettings.notification.password-description',
        actions: [Action],
      },
      {
        title: 'accountsettings.notification.messages',
        description: 'accountsettings.notification.messages-description',
        actions: [Action],
      },
      {
        title: 'accountsettings.notification.todo',
        description: 'accountsettings.notification.todo-description',
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
