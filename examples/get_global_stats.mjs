'use strict';

import { default as Trex } from '../index.mjs';
import { default as clog } from 'ee-log';

const trex = new Trex({
  server: 'tcp://trex.straylight.goosga.ng:4501',
});

await trex.connect();

let response = '';

response = await trex.get_global_stats();
clog.debug(response);
