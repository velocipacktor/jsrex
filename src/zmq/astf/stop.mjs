'use strict';

// ASTF version of "Stop traffic"
// https://trex-tgn.cisco.com/trex/doc/trex_rpc_server_spec.html#_stop_traffic_2

export async function stop({
  api_h = this.api_h,
  user = this.user,
  handler = this.port_handler,
  profile_id = null, // [optional] - profile id associated with this profile
} = {}) {
  const response = await this.send('stop', {
    api_h: api_h,
    user: user,
    handler: handler,
    profile_id: profile_id,
  });
  return response;
}
