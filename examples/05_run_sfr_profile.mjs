'use strict';

// This example shows the "json" method of loading a profile

import { default as Trex } from '../index.mjs';

import { readFileSync } from 'fs';

import { default as clog } from 'ee-log';

const session_id = 123456;
const force_acquire = true;

const multiplier = 100;
const duration = 30;

const trex = new Trex({
  server: 'tcp://trex.straylight.goosga.ng:4501', // Default 127.0.0.1:4501
  debug: false, // Default false
  user: 'goos', // Default uuid.v4()
  manage_api_h: true, // Default true - Have the library manage the api_h variable for us
  manage_port_handler: true, // Default true - Have the lib manage the handler var (from acquire()) for us
});

const sfrProfile = {
  profile_id: 'sfr',
  profile: readFileSync('examples/profiles/sfr/sfr.json'),
};

await trex.connect();

let response = '';

// Acquire ports
response = await trex.acquire({ session_id: session_id, force: force_acquire });
clog.debug(response);

// Clear old profile by the same name
await trex.profile_clear({
  profile_id: sfrProfile.profile_id,
});

await trex.astf_load_profile(sfrProfile.profile.toString(), sfrProfile.profile_id);

// Upload chunked profile

response = await trex.get_profile_list();
clog.debug(response);

await trex.start({
  duration: duration,
  mult: multiplier,
  nc: false,
  ipv6: false,
  latency: 0,
  profile_id: sfrProfile.profile_id,
});

const interval = setInterval(async () => {
  response = await trex.get_global_stats();
  clog.debug(response);
}, 5000);

setTimeout(async () => {
  clearInterval(interval);
  await trex.stop({
    profile_id: sfrProfile.profile_id,
  });
  await trex.release();
}, duration * 1000 + 500);
