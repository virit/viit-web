import React, { Component, Fragment } from 'react';
import { List } from 'antd';

type Unpacked<T> = T extends (infer U)[] ? U : T;
const passwordStrength = {
  strong: <span className="strong">Strong</span>,
  medium: <span className="medium">Medium</span>,
  weak: <span className="weak">Weak Weak</span>,
};

class SecurityView extends Component {
  getData = () => [
    {
      title: 'myandaccountsettings.security.password',
      description: (
        <Fragment>
          myandaccountsettings.security.password-description：
          {passwordStrength.strong}
        </Fragment>
      ),
      actions: [<a key="Modify">Modify</a>],
    },
    {
      title: 'myandaccountsettings.security.phone',
      description: `${'myandaccountsettings.security.phone-description'}：138****8293`,
      actions: [<a key="Modify">Modify</a>],
    },
    {
      title: 'myandaccountsettings.security.question',
      description: 'myandaccountsettings.security.question-description',
      actions: [<a key="Set">Set</a>],
    },
    {
      title: 'myandaccountsettings.security.email',
      description: `${'myandaccountsettings.security.email-description'}：ant***sign.com`,
      actions: [<a key="Modify">Modify</a>],
    },
    {
      title: 'myandaccountsettings.security.mfa',
      description: 'myandaccountsettings.security.mfa-description',
      actions: [<a key="bind">Bind</a>],
    },
  ];

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

export default SecurityView;
