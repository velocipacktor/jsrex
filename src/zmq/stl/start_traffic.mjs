'use strict';

// Stateless version of "Start traffic"
// https://trex-tgn.cisco.com/trex/doc/trex_rpc_server_spec.html#_start_traffic

export async function start_traffic({
  api_h = this.api_h,
  user = this.user,
  handler = this.port_handler,
  duration = 30,
  multiplier = 1,
  core_mask = 0xffffffff, // Mask of client ports. bit is 0 ⇒ client is disabled.
  profile_id = '_', // Use default profile if none specified
  port_id = 0, // Use default port if none
} = {}) {
  const response = await this.send('start_traffic', {
    api_h: api_h,
    user: user,
    handler: handler,
    profile_id: profile_id,
    duration: duration,
    core_mask: core_mask,
    port_id: port_id,
    mul: {
      op: 'abs',
      type: 'raw',
      value: multiplier,
    },
  });
  return response;
}
