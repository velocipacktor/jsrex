'use strict';

// Clear profile on the loaded state
// https://trex-tgn.cisco.com/trex/doc/trex_rpc_server_spec.html#_clear_profile

export async function profile_clear({
  api_h = this.api_h,
  user = this.user,
  handler = this.handler,
  profile_id = null, // Profile id/name to remove
} = {}) {
  const response = await this.send('profile_clear', {
    api_h: api_h,
    user: user,
    handler: handler,
    profile_id: profile_id,
  });
  return response;
}
