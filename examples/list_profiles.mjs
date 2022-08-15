'use strict';

import { default as Trex } from '../index.mjs';
import { default as clog } from 'ee-log';

const trex = new Trex({
  server: 'tcp://trex.straylight.goosga.ng:4501',
});

await trex.connect();

let response = '';

response = await trex.acquire({ session_id: 123456, force: true });
clog.debug(response);

const handler = response.result.handler;

response = await trex.get_profile_list({
  handler: handler,
});
clog.debug(response);
