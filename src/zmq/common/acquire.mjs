'use strict';

// Takes ownership over the port
// https://trex-tgn.cisco.com/trex/doc/trex_rpc_server_spec.html#_acquire

export async function acquire({
  api_h = this.api_h,
  user = this.user,
  port_id = 0, // Port to seize
  force = false, // Force?
  session_id = Math.floor(Math.random() * 1000), // Session ID - not documented as required, not sure what it does.
} = {}) {
  // Send the request and wait for response
  const response = await this.send('acquire', {
    api_h: api_h,
    user: user,
    port_id: port_id,
    force: force,
    session_id: session_id,
  });

  // Return the response
  return response;
}
