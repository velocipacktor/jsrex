'use strict';

import { default as Trex } from '../index.mjs';
import { default as clog } from 'ee-log';
import { default as hjson } from 'hjson';
import { readFileSync } from 'fs';
import { createHash } from 'crypto';

const trex = new Trex({
  server: 'tcp://trex.straylight.goosga.ng:4501',
});

await trex.connect();

let response = '';

const profile = hjson.parse(readFileSync(`examples/profiles/http.hjson`).toString());

const profileString = JSON.stringify(profile, null, 2);

const md5sum = createHash('md5')
  .update(profile.toString())
  .digest('hex');

response = await trex.acquire({ session_id: 123456, force: true });
const handler = response.result.handler;
clog.debug(response);

response = await trex.profile_fragment({
  handler: handler,
  frag_first: true,
  frag_last: true,
  md5: md5sum,
  fragment: profileString,
});
clog.debug(response);

response = await trex.get_profile_list({
  handler: handler,
});
clog.debug(response);
