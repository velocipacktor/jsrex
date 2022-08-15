'use strict';

import { default as Trex } from '../index.mjs';

import { default as clog } from 'ee-log';
import { default as hjson } from 'hjson';
import { readFileSync } from 'fs';
import { createHash } from 'crypto';
import { v4 as uuid } from 'uuid';

const trex = new Trex({
  debug: true,
  server: 'tcp://trex.straylight.goosga.ng:4501',
});

await trex.connect();

let response = '';

const profile = JSON.parse(readFileSync(`examples/profiles/http.json`).toString());

const profileID = uuid();

const profileString = JSON.stringify(profile, null, 2);

const md5sum = createHash('md5')
  .update(profile.toString())
  .digest('hex');

response = await trex.acquire({ session_id: 123456, force: true });
const handler = response.result.handler;

response = await trex.profile_fragment({
  handler: handler,
  frag_first: true,
  frag_last: true,
  profile_id: profileID,
  md5: md5sum,
  fragment: profileString,
});
clog.debug(response);

response = await trex.start({
  duration: 20,
  mult: 1000000,
  nc: false,
  ipv6: false,
  latency: 0,
  profile_id: profileID,
});
clog.debug(response);

const interval = setInterval(async () => {
  response = await trex.get_global_stats();
  clog.debug(response);
}, 5000);

setTimeout(async () => {
  response = await trex.get_global_stats();
  clog.debug(response);
  response = await trex.stop({
    profile_id: profileID,
  });
  clog.debug(response);
  clearInterval(interval);
}, 30500);
