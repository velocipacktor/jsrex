'use strict';

// eslint-disable-next-line node/no-unpublished-import
import { default as chunk } from 'chunk-text';
import { createHash } from 'crypto';

// Calls profile_fragment() as necessary to upload the json profile

export async function astf_load_profile(profileString, profile_id) {
  const md5sum = createHash('md5')
    .update(profileString)
    .digest('hex');

  // Chunk profile string
  const chunkedProfile = chunk(profileString, 10240);

  await this.profile_fragment({
    frag_first: true,
    frag_last: false,
    profile_id: profile_id,
    md5: md5sum,
    fragment: chunkedProfile[0],
  });

  for (let i = 1; i < chunkedProfile.length - 1; i++) {
    await this.profile_fragment({
      frag_first: false,
      frag_last: false,
      profile_id: profile_id,
      // eslint-disable-next-line security/detect-object-injection
      fragment: chunkedProfile[i],
    });
  }

  // Last chunk
  await this.profile_fragment({
    frag_first: false,
    frag_last: true,
    profile_id: profile_id,
    fragment: chunkedProfile[chunkedProfile.length - 1],
  });
}
