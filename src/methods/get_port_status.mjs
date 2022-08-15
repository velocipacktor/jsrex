'use strict';

// Queries the server for status of port
// https://trex-tgn.cisco.com/trex/doc/trex_rpc_server_spec.html#_get_port_status

export async function get_port_status({
  api_h = this.api_h,
  user = this.user,
  port_id = 0, // Port id to query for registered profiles
  profile_id = '', // Profile id to query for registered profiles
} = {}) {
  // Send the request and wait for response
  const response = await this.send('get_port_status', {
    api_h: api_h,
    user: user,
    port_id: port_id,
    profile_id: profile_id,
  });
  // Return the response
  return response;
}
