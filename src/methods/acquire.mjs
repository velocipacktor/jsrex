'use strict';

export default async function acquire({ port_id = 0, force = false, session_id = 0 }) {
  const response = await this.send('acquire', {
    port_id: port_id,
    force: force,
    session_id: session_id,
  });
  return response;
}
