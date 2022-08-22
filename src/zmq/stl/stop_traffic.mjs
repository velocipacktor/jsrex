'use strict';

// Stateless version of "Stop traffic"
// https://trex-tgn.cisco.com/trex/doc/trex_rpc_server_spec.html#_stop_traffic

export async function stop_traffic({
  api_h = this.api_h,
  user = this.user,
  handler = this.port_handler,
  profile_id = '_', // Use default profile if none specified
  port_id = 0, // Use default port if none
} = {}) {
  const response = await this.send('stop_traffic', {
    api_h: api_h,
    user: user,
    handler: handler,
    profile_id: profile_id,
    port_id: port_id,
  });
  return response;
}
