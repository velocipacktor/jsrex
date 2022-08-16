'use strict';

// Removes a stream from a port
// https://trex-tgn.cisco.com/trex/doc/trex_rpc_server_spec.html#_remove_stream

export async function remove_stream({
  api_h = this.api_h,
  user = this.user,
  handler = this.port_handler,
  port_id = 0, // Port ID associated with this profile and stream
  stream_id = null,
} = {}) {
  const response = await this.send('remove_stream', {
    api_h: api_h,
    user: user,
    handler: handler,
    port_id: port_id,
    stream_id: stream_id,
  });
  return response;
}
