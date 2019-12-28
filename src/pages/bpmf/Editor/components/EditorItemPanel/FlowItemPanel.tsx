import { Item, ItemPanel } from 'gg-editor';

import { Card } from 'antd';
import React from 'react';
import styles from './index.less';
import startSvg from  './icons/start.svg';
import endSvg from './icons/end.svg';
import taskSvg from './icons/task.svg';
import gatewaySvg from './icons/gateway.svg';

const FlowItemPanel = () => (
  <ItemPanel className={styles.itemPanel}>
    <Card bordered={false}>
      <Item
        type="node"
        size="48*48"
        shape="flow-circle"
        model={{
          color: '#FA8C16',
          name: '开始',
          type: 'start',
          label: '开始',
          executionListenerData: [],
        }}
        src={startSvg}
      />
      <Item
        type="node"
        size="48*48"
        shape="flow-circle"
        model={{
          color: '#FA8C16',
          label: '结束',
          type: 'end',
          name: '结束',
          executionListenerData: [],
        }}
        src={endSvg}
      />
      <Item
        type="node"
        size="80*48"
        shape="flow-rect"
        model={{
          type: 'task',
          color: '#1890FF',
          label: '任务',
          name: '任务',
          executionListenerData: [],
          taskListenerData: [],
        }}
        src={taskSvg}
      />
      <Item
        type="node"
        size="80*72"
        shape="flow-rhombus"
        model={{
          color: '#13C2C2',
          label: '网关',
          name: '网关',
          type: 'gateway',
        }}
        src={gatewaySvg}
      />
      {/*<Item*/}
      {/*  type="node"*/}
      {/*  size="80*48"*/}
      {/*  shape="flow-capsule"*/}
      {/*  model={{*/}
      {/*    color: '#722ED1',*/}
      {/*    label: 'Model',*/}
      {/*  }}*/}
      {/*  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iNTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxyZWN0IGlkPSJiIiB4PSIwIiB5PSIwIiB3aWR0aD0iODAiIGhlaWdodD0iNDgiIHJ4PSIyNCIvPjxmaWx0ZXIgeD0iLTguOCUiIHk9Ii0xMC40JSIgd2lkdGg9IjExNy41JSIgaGVpZ2h0PSIxMjkuMiUiIGZpbHRlclVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgaWQ9ImEiPjxmZU9mZnNldCBkeT0iMiIgaW49IlNvdXJjZUFscGhhIiByZXN1bHQ9InNoYWRvd09mZnNldE91dGVyMSIvPjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjIiIGluPSJzaGFkb3dPZmZzZXRPdXRlcjEiIHJlc3VsdD0ic2hhZG93Qmx1ck91dGVyMSIvPjxmZUNvbXBvc2l0ZSBpbj0ic2hhZG93Qmx1ck91dGVyMSIgaW4yPSJTb3VyY2VBbHBoYSIgb3BlcmF0b3I9Im91dCIgcmVzdWx0PSJzaGFkb3dCbHVyT3V0ZXIxIi8+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwLjA0IDAiIGluPSJzaGFkb3dCbHVyT3V0ZXIxIi8+PC9maWx0ZXI+PC9kZWZzPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNCAyKSI+PHVzZSBmaWxsPSIjMDAwIiBmaWx0ZXI9InVybCgjYSkiIHhsaW5rOmhyZWY9IiNiIi8+PHVzZSBmaWxsLW9wYWNpdHk9Ii45MiIgZmlsbD0iI0Y5RjBGRiIgeGxpbms6aHJlZj0iI2IiLz48cmVjdCBzdHJva2U9IiNCMzdGRUIiIHg9Ii41IiB5PSIuNSIgd2lkdGg9Ijc5IiBoZWlnaHQ9IjQ3IiByeD0iMjMuNSIvPjwvZz48dGV4dCBmb250LWZhbWlseT0iUGluZ0ZhbmdTQy1SZWd1bGFyLCBQaW5nRmFuZyBTQyIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIuNjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQgMikiPjx0c3BhbiB4PSIyNCIgeT0iMjkiPk1vZGVsPC90c3Bhbj48L3RleHQ+PC9nPjwvc3ZnPg=="*/}
      {/*/>*/}
    </Card>
  </ItemPanel>
);

export default FlowItemPanel;
