type LineTargetType = 'in' | 'out';

const findLine = (data:any, id: string, type: LineTargetType) => {
  const list = [];
  for (let dataKey in data) {
    const item = data[dataKey];
    // if (type === 'in' && item.source === id) {
    //   list.push(item);
    // }
    if (type === 'out' && item.target === id) {
      list.push(item);
    }
  }
  return list;
};

const createListenerElement = (doc:XMLDocument, listeners: any[], listenerType = 'execution') => {
  const result:Node[] = [];
  listeners.forEach((listener:any) => {
    const listenerElement = doc.createElement(`camunda:${listenerType}Listener`);
    listenerElement.setAttribute('class', listener.classpath);
    listenerElement.setAttribute('name', listener.name);
    listenerElement.setAttribute('event', listener.event);
    // 监听器参数
    const fields = listener.fields;
    if (fields && fields.length > 0) {
      fields.forEach((field: any) => {
        const fieldElement = doc.createElement('camunda:field');
        fieldElement.setAttribute('name', field.name);
        const valueElement = doc.createElement('camunda:string');
        valueElement.textContent = field.value;
        fieldElement.appendChild(valueElement);
        listenerElement.appendChild(fieldElement);
      });
    }
    result.push(listenerElement);
  });
  return result;
};

const findInOut:(doc:XMLDocument, id:string, data:any) =>Node[]
  = (doc:XMLDocument, id:string, data:any) => {
  const list = [] as Node[];
  const inLines = findLine(data, id, 'in');
  inLines.forEach(it => {
    const outElement = doc.createElement('bpmn2:outgoing');
    outElement.textContent = '_' + it.id;
    list.push(outElement);
  });
  const outLines = findLine(data, id, 'out');
  outLines.forEach(it => {
    const inElement = doc.createElement('bpmn2:incoming');
    inElement.textContent = '_' + it.id;
    list.push(inElement);
  });
  return list;
};

export default {
  'start': {
    toXmlNode: (doc:XMLDocument, jsonNode:any, data:any) => {
      const element = doc.createElement('bpmn2:startEvent');
      element.setAttribute("id", '_' + jsonNode.id);
      element.setAttribute("name", jsonNode.name);
      const extensionElements = doc.createElement('bpmn2:extensionElements');
      element.appendChild(extensionElements);
      // 监听器
      const executionListener = jsonNode.executionListenerData;
      if (executionListener !== undefined && executionListener.length > 0) {
        const elements = createListenerElement(doc, executionListener);
        elements.forEach(it => extensionElements.appendChild(it));
      }
      // 连接线
      findInOut(doc, jsonNode.id, data).forEach(it => element.appendChild(it));
      return element;
    }
  },
  'task': {
    toXmlNode: (doc:XMLDocument, jsonNode:any, data:any) => {
      const element = doc.createElement('bpmn2:task');
      element.setAttribute("id", '_' + jsonNode.id);
      element.setAttribute("name", jsonNode.name);

      const extensionElements = doc.createElement('bpmn2:extensionElements');
      element.appendChild(extensionElements);
      // 监听器
      const executionListener = jsonNode.executionListenerData;
      if (executionListener !== undefined && executionListener.length > 0) {
        const elements = createListenerElement(doc, executionListener);
        elements.forEach(it => extensionElements.appendChild(it));
      }
      const taskListener = jsonNode.taskListenerData;
      if (taskListener !== undefined && taskListener.length > 0) {
        const elements = createListenerElement(doc, taskListener, 'task');
        elements.forEach(it => extensionElements.appendChild(it));
      }
      findInOut(doc, jsonNode.id, data).forEach(it => element.appendChild(it));
      return element;
    },
  },
  'end': {
    toXmlNode: (doc:XMLDocument, jsonNode:any, data:any) => {
      const element = doc.createElement('bpmn2:endEvent');
      element.setAttribute("id", '_' + jsonNode.id);
      element.setAttribute("name", jsonNode.name);
      const extensionElements = doc.createElement('bpmn2:extensionElements');
      element.appendChild(extensionElements);
      // 监听器
      const executionListener = jsonNode.executionListenerData;
      if (executionListener !== undefined && executionListener.length > 0) {
        const elements = createListenerElement(doc, executionListener);
        elements.forEach(it => extensionElements.appendChild(it));
      }
      // 连接线
      findInOut(doc, jsonNode.id, data).forEach(it => element.appendChild(it));
      return element;
    },
  },
  'line': {
    toXmlNode: (doc:XMLDocument, jsonNode:any, data:any) => {
      const element = doc.createElement('bpmn2:sequenceFlow');
      element.setAttribute("id", '_' + jsonNode.id);
      if (jsonNode.label !== undefined) {
        element.setAttribute("name", jsonNode.label);
      }
      element.setAttribute("sourceRef", '_' + jsonNode.source);
      element.setAttribute("targetRef", '_' + jsonNode.target);
      return element;
    },
  },
  'gateway': {
    toXmlNode: (doc:XMLDocument, jsonNode:any, data:any) => {
      const element = doc.createElement('bpmn2:sequenceFlow');
      element.setAttribute("id", '_' + jsonNode.id);
      element.setAttribute("name", jsonNode.name);
      return element;
    },
  }
}
