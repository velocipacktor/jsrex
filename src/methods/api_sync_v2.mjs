'use strict';

export default async function api_sync_v2() {
  const response = await this.send('api_sync_v2', {
    name: 'ASTF',
    major: 2,
    minor: 3,
  });
  const api_h = response.result.api_h;
  return api_h;
}
