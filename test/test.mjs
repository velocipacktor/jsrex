'use strict';

import { default as Trex } from '../index.mjs';

const trex = new Trex({
  server: 'tcp://trex.straylight.goosga.ng:4501',
});

await trex.connect();

const result = await trex.methods.acquire({ session_id: 123456, force: true });

console.log(result);
