'use strict';

import { v4 as uuid } from 'uuid';

// Load ASTF JSON profile in small chunks (how small?)
// https://trex-tgn.cisco.com/trex/doc/trex_rpc_server_spec.html#_load_profile

export async function profile_fragment({
  api_h = this.api_h,
  user = this.user,
  profile_id = uuid(),
  handler = this.handler, // Unique connection handler (from acquire())
  frag_first = false, // True in case this is the first fragment
  frag_last = false, // True in case this is the last fragment
  md5 = '', // Come in first message with frag_first=true
  fragment = '', // Fragment of input JSON string
} = {}) {
  const response = await this.send('profile_fragment', {
    api_h: api_h,
    user: user,
    handler: handler,
    profile_id: profile_id,
    frag_first: frag_first,
    frag_last: frag_last,
    md5: md5,
    fragment: fragment,
  });
  return response;
}
