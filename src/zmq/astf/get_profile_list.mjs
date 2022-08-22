'use strict';

// Get profile list
// https://trex-tgn.cisco.com/trex/doc/trex_rpc_server_spec.html#_get_profile_id_list_2

export async function get_profile_list({
  api_h = this.api_h,
  handler = this.port_handler, // Unique connection handler (from acquire())
  port_id = 0,
  profile_id = '*',
} = {}) {
  // Send the request and wait for response
  const response = await this.send('get_profile_list', {
    api_h: api_h,
    handler: handler,
    port_id: port_id,
    profile_id: profile_id,
  });
  // Return the response
  return response;
}
