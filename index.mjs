'use strict';

import { default as zmq } from 'zeromq';
import { v4 as uuid } from 'uuid';
import { default as events } from 'events';
import { default as clog } from 'ee-log';

// ASTF
import { get_profile_list as _get_profile_list } from './src/zmq/astf/get_profile_list.mjs';
import { profile_fragment as _profile_fragment } from './src/zmq/astf/profile_fragment.mjs';
import { profile_clear as _profile_clear } from './src/zmq/astf/profile_clear.mjs';
import { start as _start } from './src/zmq/astf/start.mjs';
import { stop as _stop } from './src/zmq/astf/stop.mjs';

// Common
import { acquire as _acquire } from './src/zmq/common/acquire.mjs';
import { api_sync_v2 as _api_sync_v2 } from './src/zmq/common/api_sync_v2.mjs';
import { get_global_stats as _get_global_stats } from './src/zmq/common/get_global_stats.mjs';
import { get_port_status as _get_port_status } from './src/zmq/common/get_port_status.mjs';
import { release as _release } from './src/zmq/common/release.mjs';

// STL
import { add_stream as _add_stream } from './src/zmq/stl/add_stream.mjs';
import { remove_stream as _remove_stream } from './src/zmq/stl/remove_stream.mjs';

// Utils
import { astf_load_profile } from './src/utils/astf_load_profile.mjs';

export default class Trex extends events.EventEmitter {
  constructor(options) {
    // Magic.
    super();

    // Setup default options
    this.server = options.server || 'tcp://127.0.0.1:4501';
    this.debug = options.debug || false;
    this.user = options.user || uuid();
    this.manage_api_h = options.manage_api_h || true;
    this.manage_port_handler = options.manage_port_handler || true;
    this.api_h = options.api_h || '';
    this.port_handler = options.port_handler || '';

    // Setup the connection
    this.zmqSock = new zmq.Request();
    this.connected = false;

    // Methods
    // ASTF
    this.get_profile_list = _get_profile_list.bind(this);
    this.profile_fragment = _profile_fragment.bind(this);
    this.profile_clear = _profile_clear.bind(this);
    this.start = _start.bind(this);
    this.stop = _stop.bind(this);

    // Common
    // Functions acquire, api_sync_v2 handled below
    this.__acquire = _acquire.bind(this);
    this.__api_sync_v2 = _api_sync_v2.bind(this);
    this.get_global_stats = _get_global_stats.bind(this);
    this.get_port_status = _get_port_status.bind(this);
    this.release = _release.bind(this);

    // STL
    this.add_stream = _add_stream.bind(this);
    this.remove_stream = _remove_stream.bind(this);

    // Utils
    this.astf_load_profile = astf_load_profile;
  }

  async api_sync_v2(options) {
    const response = await this.__api_sync_v2(options);
    if (typeof response.error === 'undefined') {
      if (this.manage_api_h) {
        this.api_h = response.result.api_h;
      }
    }
    return response;
  }

  async acquire(options) {
    const response = await this.__acquire(options);
    if (typeof response.error === 'undefined') {
      if (this.manage_port_handler) {
        this.port_handler = response.result.handler;
      }
    }
    return response;
  }

  // Set/Retrieve global api_h
  async set_api_h(api_h) {
    if (typeof api_h === 'string') {
      this.api_h = api_h;
    }
    return this.api_h;
  }

  async set_port_handler(port_handler) {
    if (typeof port_handler === 'string') {
      this.port_handler = port_handler;
    }
    return this.port_handler;
  }

  //
  // Connect to the t-rex server
  async connect() {
    // Connect
    await this.zmqSock.connect(this.server);
    if (this.manage_api_h) {
      await this.api_sync_v2();
    }
    // Emit the event
    this.emit('connected');
    this.connected = true;
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
