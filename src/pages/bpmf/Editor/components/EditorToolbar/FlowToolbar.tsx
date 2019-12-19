import {Divider, Icon, Tooltip} from 'antd';
import React from 'react';
import {Toolbar} from 'gg-editor';
import ToolbarButton from './ToolbarButton';
import styles from './index.less';

const FlowToolbar = () => (
  <Toolbar className={styles.toolbar} style={{paddingLeft: '8px'}}>
    <Tooltip
      title="保存"
      placement="bottom"
      overlayClassName={styles.tooltip}
    >
      <Icon type="save" />
    </Tooltip>
    <Divider type="vertical" />
    <ToolbarButton command="undo" text="撤销" />
    <ToolbarButton command="redo" text="重做" />
    <Divider type="vertical" />
    <ToolbarButton command="copy" text="复制" />
    <ToolbarButton command="paste" text="粘贴" />
    <ToolbarButton command="delete" text="删除" />
    <Divider type="vertical" />
    <ToolbarButton command="zoomIn" icon="zoom-in" text="放大" />
    <ToolbarButton command="zoomOut" icon="zoom-out" text="缩小" />
    <ToolbarButton command="autoZoom" icon="fit-map" text="自适应" />
    <ToolbarButton command="resetZoom" icon="actual-size" text="实际大小" />
    <Divider type="vertical" />
    <ToolbarButton command="toBack" icon="to-back" text="To Back" />
    <ToolbarButton command="toFront" icon="to-front" text="To Front" />
    <Divider type="vertical" />
    <ToolbarButton command="multiSelect" icon="multi-select" text="Multi Select" />
    <ToolbarButton command="addGroup" icon="group" text="Add Group" />
    <ToolbarButton command="unGroup" icon="ungroup" text="Ungroup" />
  </Toolbar>
);

export default FlowToolbar;
