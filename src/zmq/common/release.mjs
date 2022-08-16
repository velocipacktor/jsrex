'use strict';

// Release ownership over the port
// https://trex-tgn.cisco.com/trex/doc/trex_rpc_server_spec.html#_release

export async function release({
  api_h = this.api_h,
  user = this.user,
  handler = this.port_handler,
  port_id = 0, // Port to release
} = {}) {
  // Send the request and wait for response
  const response = await this.send('release', {
    api_h: api_h,
    user: user,
    handler: handler,
    port_id: port_id,
  });
  // Return the response
  return response;
}
