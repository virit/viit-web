import {Col, message, Row, Spin} from 'antd';
import GGEditor, {Flow} from 'gg-editor';
import {PageHeaderWrapper} from '@ant-design/pro-layout';
import React, {useEffect, useState} from 'react';
import EditorMinimap from './components/EditorMinimap';
import {FlowContextMenu} from './components/EditorContextMenu';
import {FlowDetailPanel} from './components/EditorDetailPanel';
import {FlowItemPanel} from './components/EditorItemPanel';
import {FlowToolbar} from './components/EditorToolbar';
import styles from './index.less';
import TypeHandler from "@/pages/bpmf/Editor/TypeHandler";
import {getEditorJsonSource, getModelById, saveEditorSource} from "@/pages/bpmf/model/service";

const transferToXml = (dataMap: any, processId: string) => {
  const docBaseText = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:camunda="http://camunda.org/schema/1.0/bpmn" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">\n' +
    `<bpmn2:process id="${processId}" isExecutable="true"></bpmn2:process></bpmn2:definitions>`;
  const doc = new DOMParser().parseFromString(docBaseText, 'text/xml');
  const rootNode = doc.getElementsByTagName('bpmn2:process').item(0);
  for (let key in dataMap) {
    const item = dataMap[key];
    const handler = item.type !== undefined ? TypeHandler[item.type] : TypeHandler['line'];
    if (handler) {
      const element = handler.toXmlNode(doc, item, dataMap);
      if (rootNode) {
        rootNode.appendChild(element);
      }
    }
  }
  return doc.documentElement.outerHTML;
};

interface Props {
  match: any;
}

GGEditor.setTrackable(false);
const Editor: React.FC<Props> = ({match}) => {

  const [data, setData] = useState({});
  const [jsonData, setJsonData] = useState({});
  const [loading, setLoading] = useState(false);
  const [saveAble, setSaveAble] = useState(false);
  const [modelInfo, setModelInfo] = useState({} as any);
  const id = match.params['id'];

  useEffect(() => {
    setLoading(true);
    getEditorJsonSource(id).then(resp => {
      setJsonData(resp.data === '' ? {} : resp.data || {});
      setLoading(false);
    });
    getModelById(id).then(resp => {
      setModelInfo(resp.data);
    });
  }, []);

  const normalizeJson:(jsonData:any)=>any = function (jsonData) {
    const nodes = [];
    const edges = [];
    for (let key in jsonData) {
      const item = jsonData[key];
      if (item.type !== undefined) {
        nodes.push(item);
      } else {
        edges.push(item);
      }
    }
    return {
      nodes,
      edges,
    };
  };

  const onSave = () => {
    const xml = '<?xml version="1.0" encoding="utf-8"?>\n' + transferToXml(data, modelInfo.key);
    const json = JSON.stringify(normalizeJson(data));
    const requestData = xml + '__SPLIT__' + json;
    setLoading(true);
    saveEditorSource(id, requestData).then((resp) => {
      setLoading(false);
      message.success('保存成功！');
    });
  };

  return (
    <PageHeaderWrapper>
      <Spin spinning={loading}>
        <GGEditor className={styles.editor}>
          <Row type="flex" className={styles.editorHd}>
            <Col span={24}>
              <FlowToolbar onSave={onSave} saveAble={saveAble}/>
            </Col>
          </Row>
          <Row type="flex" className={styles.editorBd}>
            <Col span={4} className={styles.editorSidebar}>
              <FlowItemPanel/>
            </Col>
            <Col span={16} className={styles.editorContent}>
              <Flow className={styles.flow} data={jsonData} onAfterChange={(e) => {
                if ( e.item && e.item.dataMap) {
                  setSaveAble(true);
                  setData(e.item.dataMap);
                }
              }}/>
            </Col>
            <Col span={4} className={styles.editorSidebar}>
              <FlowDetailPanel/>
              <EditorMinimap/>
            </Col>
          </Row>
          <FlowContextMenu/>
        </GGEditor>
      </Spin>
    </PageHeaderWrapper>
  )
};
export default Editor;
