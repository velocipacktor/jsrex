'use strict';

// Sooooo... _v2 isn't documented
// Here's the info for not-_v2:
// https://trex-tgn.cisco.com/trex/doc/trex_rpc_server_spec.html#_api_synchronization

export async function api_sync_v2({
  api_h = this.api_h,
  user = this.user,
  name = 'ASTF', // API Subclass?
  major = 2, // API Maj Ver
  minor = 3, // API Min Ver
} = {}) {
  // Send the request and wait for the response
  const response = await this.send('api_sync_v2', {
    api_h: api_h,
    user: user,
    name: name,
    major: major,
    minor: minor,
  });

  // Return the response
  return response;
}
