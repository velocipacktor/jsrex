'use strict';

// Global (all port) stats
// https://trex-tgn.cisco.com/trex/doc/trex_rpc_server_spec.html#_get_global_stats

export async function get_global_stats({ api_h = this.api_h, user = this.user } = {}) {
  const response = await this.send('get_global_stats', {
    api_h: api_h,
    user: user,
  });
  return response;
}
