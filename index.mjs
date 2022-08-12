'use strict';

import { default as zmq } from 'zeromq';
import { v4 as uuid } from 'uuid';
import { default as events } from 'events';

import { default as api_sync_v2 } from './src/methods/api_sync_v2.mjs';
import { default as acquire } from './src/methods/acquire.mjs';

export default class Trex extends events.EventEmitter {
  constructor(options) {
    super();
    this.options = options || {
      server: 'tcp://127.0.0.1:4501',
    };
    this.zmqSock = new zmq.Request();
    this.connected = false;
    this.methods = {
      api_sync_v2: api_sync_v2.bind(this),
      acquire: acquire.bind(this),
    };
  }

  async connect() {
    await this.zmqSock.connect(this.options.server);
    this.emit('connected');
    this.connected = true;
    this.api_h = await this.methods.api_sync_v2();
    return this.api_h;
  }

  async send(method, params) {
    const msg = {
      jsonrpc: '2.0',
      id: uuid(),
      method: method,
      params: params,
    };

    msg.params.api_h = this.api_h;
    msg.params.user = 'trex';

    console.log(msg);

    await this.zmqSock.send(JSON.stringify(msg));
    const [response] = await this.zmqSock.receive();
    const buffer = Buffer.from(response);
    const json = JSON.parse(buffer.toString());

    this.emit('message', json);
    return json;
  }
}
