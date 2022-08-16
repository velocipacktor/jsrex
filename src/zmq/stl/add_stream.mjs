'use strict';

import { v4 as uuid } from 'uuid';

// Adds a stream to a port
// https://trex-tgn.cisco.com/trex/doc/trex_rpc_server_spec.html#_add_stream

export async function add_stream({
  api_h = this.api_h,
  user = this.user,
  handler = this.port_handler,
  port_id = 0, // Port ID associated with this profile and stream
  profile_id = uuid(), // Profile id associated
  stream_id = Math.floor(Math.random() * 1000),
  stream = {},
} = {}) {
  const response = await this.send('add_stream', {
    api_h: api_h,
    user: user,
    handler: handler,
    port_id: port_id,
    profile_id: profile_id,
    stream_id: stream_id,
    stream: stream,
  });
  return response;
}
