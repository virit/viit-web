interface RequestType {
  path: string;
  data: any;
  success?: (response: object) => void;
}

interface PackageType {
  id: string;
  path?: string;
  message?: string;
  code?: number;
}

function guid():string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

export default class WebSocketClient {

  ws:WebSocket;

  messageQueue: string[] = [];

  isOpen: boolean = false;

  messageMap: {[k: string]: (resp:any) => void} = {};

  listener: {[k: string]: {callback: (resp:any) => any, path: string}} = {};

  constructor(path:string) {
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    this.ws = new WebSocket(protocol + '://' + window.location.host + path);
    this.ws.onopen = () => {
      this.isOpen = true;
      this.messageQueue.forEach(message => {
        this.ws.send(message);
      });
    };

    this.ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data) as PackageType;
      if (data.path !== undefined && data.path !== '') {
        const message = JSON.parse(data.message || '');
        for (let k in this.listener) {
          const v = this.listener[k];
          if (v.path === data.path) {
            const listener = v.callback;
            if (listener) {
              const result = listener(message);
              const resultPackage:PackageType = {
                id: guid(),
                code: 200,
                message: JSON.stringify(result),
              };
              this.ws.send(JSON.stringify(resultPackage));
            }
          }
        }
      } else {
        if (data.code === 200) {
          const success = this.messageMap[data.id];
          const response = JSON.parse(data.message + '');
          success(response);
          delete this.messageMap[data.id];
        }
      }
    };

    this.ws.onclose = () => {
    };
  }

  sendRequest(request: RequestType) {
    const id = guid();
    if (request.success !== undefined) {
      this.messageMap[id] = request.success;
    }
    let packageData: PackageType = {
      id,
      path: request.path,
      message: JSON.stringify(request.data),
    };
    const message = JSON.stringify(packageData);
    if (this.isOpen) {
      this.ws.send(message);
    } else {
      this.messageQueue.push(message);
    }
    return this;
  }

  listen(path: string, callback: (data: any) => any) {
    const id = guid();
    this.listener[id] = {
      path,
      callback,
    };
    return id;
  }

  unlisten(id: string) {
    delete this.listener[id];
  }
}
