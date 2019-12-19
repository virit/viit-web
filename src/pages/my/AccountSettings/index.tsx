import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { GridContent } from '@ant-design/pro-layout';
import { Menu } from 'antd';
import { connect } from 'dva';
import BaseView from './components/base';
import BindingView from './components/binding';
import { CurrentUser } from './data.d';
import NotificationView from './components/notification';
import SecurityView from './components/security';
import styles from './style.less';

const { Item } = Menu;
interface AccountsettingsProps {
  dispatch: Dispatch<any>;
  currentUser: CurrentUser;
}
type AccountsettingsStateKeys = 'base' | 'security' | 'binding' | 'notification';
interface AccountsettingsState {
  mode: 'inline' | 'horizontal';
  menuMap: {
    [key: string]: React.ReactNode;
  };
  selectKey: AccountsettingsStateKeys;
}

@connect(({ myAndaccountsettings }: { myAndaccountsettings: { currentUser: CurrentUser } }) => ({
  currentUser: myAndaccountsettings.currentUser,
}))
class Accountsettings extends Component<AccountsettingsProps, AccountsettingsState> {
  main: HTMLDivElement | undefined = undefined;

  constructor(props: AccountsettingsProps) {
    super(props);
    const menuMap = {
      base: 'Basic Settings',
      security: 'Security Settings',
      binding: 'Account Binding',
      notification: 'New Message Notification',
    };
    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: 'base',
    };
  }

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'myAndaccountsettings/fetchCurrent',
    // });
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getMenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map(item => <Item key={item}>{menuMap[item]}</Item>);
  };

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey];
  };

  selectKey = (key: AccountsettingsStateKeys) => {
    this.setState({
      selectKey: key,
    });
  };

  resize = () => {
    if (!this.main) {
      return;
    }

    requestAnimationFrame(() => {
      if (!this.main) {
        return;
      }

      let mode: 'inline' | 'horizontal' = 'inline';
      const { offsetWidth } = this.main;

      if (this.main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }

      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }

      this.setState({
        mode,
      });
    });
  };

  renderChildren = () => {
    const { selectKey } = this.state;

    switch (selectKey) {
      case 'base':
        return <BaseView />;

      case 'security':
        return <SecurityView />;

      case 'binding':
        return <BindingView />;

      case 'notification':
        return <NotificationView />;

      default:
        break;
    }

    return null;
  };

  render() {
    // const { currentUser } = this.props;

    // if (!currentUser.userid) {
    //   return '';
    // }

    const { mode, selectKey } = this.state;
    return (
      <GridContent>
        <div
          className={styles.main}
          ref={ref => {
            if (ref) {
              this.main = ref;
            }
          }}
        >
          <div className={styles.leftMenu}>
            <Menu
              mode={mode}
              selectedKeys={[selectKey]}
              onClick={({ key }) => this.selectKey(key as AccountsettingsStateKeys)}
            >
              {this.getMenu()}
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{this.getRightTitle()}</div>
            {this.renderChildren()}
          </div>
        </div>
      </GridContent>
    );
  }
}

export default Accountsettings;
