# jsrex

## What is this?

JS bindings for Cisco T-Rex json-rpc over zmq.

## Why? Isn't there a python lib already?
Yes, there is, and if you know python you should go use that.

## Is this safe to use yet?
No. If you want to use this, pin a commit.

## How do I use this
This lib is written against node v16

```
git clone --recursive 
cd
npm install --also=dev
// on astf server: ./t-rex-64 -i --astf
node examples/01_system_info.mjs
node examples/02_list_profiles.mjs
node examples/03_run_profile.mjs
```

## Can I help?
If you want, sure. Pull requests are always welcome.
