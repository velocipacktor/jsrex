'use strict';

import { default as zmq } from 'zeromq';
import { v4 as uuid } from 'uuid';
import { default as events } from 'events';
import { default as clog } from 'ee-log';

import { acquire as _acquire } from './src/methods/acquire.mjs';
import { api_sync_v2 } from './src/methods/api_sync_v2.mjs';
import { get_global_stats } from './src/methods/get_global_stats.mjs';
import { get_port_status } from './src/methods/get_port_status.mjs';
import { get_profile_list } from './src/methods/get_profile_list.mjs';
import { profile_fragment } from './src/methods/profile_fragment.mjs';
import { profile_clear } from './src/methods/profile_clear.mjs';
import { release } from './src/methods/release.mjs';
import { start } from './src/methods/start.mjs';
import { stop } from './src/methods/stop.mjs';

export default class Trex extends events.EventEmitter {
  constructor(options) {
    // Magic.
    super();

    // Setup default options
    this.server = options.server || 'tcp://127.0.0.1:4501';
    this.debug = options.debug || false;
    this.user = options.user || uuid();

    // Setup the connection
    this.zmqSock = new zmq.Request();
    this.connected = false;

    // Methods
    this.api_sync_v2 = api_sync_v2.bind(this);
    this.get_global_stats = get_global_stats.bind(this);
    this.get_port_status = get_port_status.bind(this);
    this.get_profile_list = get_profile_list.bind(this);
    this.profile_fragment = profile_fragment.bind(this);
    this.profile_clear = profile_clear.bind(this);
    this.release = release.bind(this);
    this.start = start.bind(this);
    this.stop = stop.bind(this);
  }

  //
  // Connect to the t-rex server
  async connect() {
    // Connect
    await this.zmqSock.connect(this.server);

    // Emit the event
    this.emit('connected');
    this.connected = true;

    // Run api_sync_v2 and set global api_h
    const response = await this.api_sync_v2();
    this.api_h = response.result.api_h;

    // Return api_h as well
    return this.api_h;
  }

  //
  // Send a message to t-rex
  async send(method, params) {
    // Boilerplate
    const msg = {
      jsonrpc: '2.0',
      id: uuid(),
      method: method,
      params: params,
    };

    if (this.debug) clog.debug(`[DEBUG] zmq tx: ${method}`, msg);

    // Send the message
    await this.zmqSock.send(JSON.stringify(msg));

    // Wait for a response
    const [response] = await this.zmqSock.receive();

    // Convert it to a buffer
    const buffer = Buffer.from(response);

    // And then to json
    const json = JSON.parse(buffer.toString());

    if (this.debug) clog.debug('[DEBUG] zmq rx', json);

    // Emit an event
    this.emit('message', json);

    // And return the result
    return json;
  }

  async acquire(params) {
    params.api_h = this.api_h;
    // Acquire
    const __acquire = _acquire.bind(this);
    const response = await __acquire(params);
    this.handler = response.result.handler;
    return response;
  }
}
