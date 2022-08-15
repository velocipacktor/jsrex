'use strict';

import { default as zmq } from 'zeromq';
import { v4 as uuid } from 'uuid';
import { default as events } from 'events';
import { default as clog } from 'ee-log';

// Common
import { acquire as _acquire } from './src/methods/common/acquire.mjs';
import { api_sync_v2 as _api_sync_v2 } from './src/methods/common/api_sync_v2.mjs';
import { get_global_stats as _get_global_stats } from './src/methods/common/get_global_stats.mjs';
import { get_port_status as _get_port_status } from './src/methods/common/get_port_status.mjs';
import { release as _release } from './src/methods/common/release.mjs';

// ASTF
import { get_profile_list as _get_profile_list } from './src/methods/astf/get_profile_list.mjs';
import { profile_fragment as _profile_fragment } from './src/methods/astf/profile_fragment.mjs';
import { profile_clear as _profile_clear } from './src/methods/astf/profile_clear.mjs';
import { start as _start } from './src/methods/astf/start.mjs';
import { stop as _stop } from './src/methods/astf/stop.mjs';

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
    // Common
    this.acquire = _acquire.bind(this);
    this.api_sync_v2 = _api_sync_v2.bind(this);
    this.get_global_stats = _get_global_stats.bind(this);
    this.get_port_status = _get_port_status.bind(this);
    this.release = _release.bind(this);

    // ASTF
    this.get_profile_list = _get_profile_list.bind(this);
    this.profile_fragment = _profile_fragment.bind(this);
    this.profile_clear = _profile_clear.bind(this);
    this.start = _start.bind(this);
    this.stop = _stop.bind(this);
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
}
