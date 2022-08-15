'use strict';

// ASTF version of "Start traffic"
// https://trex-tgn.cisco.com/trex/doc/trex_rpc_server_spec.html#_start_traffic_2

export async function start({
  api_h = this.api_h,
  user = this.user,
  handler = this.handler,
  duration = 30,
  multiplier = 1,
  nc = false,
  ipv6 = false,
  latency_pps = 0,
  client_mask = 0xffffffff, // Mask of client ports. bit is 0 ⇒ client is disabled.
  e_duration = 0, // Maximum time to wait for one flow to be established.
  t_duration = 0, // Maximum time to wait for all the flow to terminate gracefully after duration.
  profile_id = '_',
} = {}) {
  const response = await this.send('start', {
    api_h: api_h,
    user: user,
    handler: handler,
    profile_id: profile_id,
    duration: duration,
    mult: multiplier,
    nc: nc,
    ipv6: ipv6,
    latency_pps: latency_pps,
    client_mask: client_mask,
    e_duration: e_duration,
    t_duration: t_duration,
  });
  return response;
}
