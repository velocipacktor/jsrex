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

  for (let i = 0; i < chunkedProfile.length; i++) {
    const fragment = {
      frag_first: null,
      frag_last: null,
      profile_id: profile_id,
      // eslint-disable-next-line security/detect-object-injection
      fragment: chunkedProfile[i],
    };

    if (i === 0) {
      fragment.frag_first = true;
      fragment.md5 = md5sum;
    } else {
      fragment.frag_first = false;
    }

    if (i === chunkedProfile.length - 1) {
      fragment.frag_last = true;
    } else {
      fragment.frag_last = false;
    }
    await this.profile_fragment(fragment);
  }
}
