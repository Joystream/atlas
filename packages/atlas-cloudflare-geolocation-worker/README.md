# Atlas Cloudflare Geolocation Worker

This repository contains code for deploying a [Cloudflare Worker](https://developers.cloudflare.com/workers/) that can be used to get user location.

**Deploying:**

```bash
# install Wrangler (CF Workers CLI)
yarn global add @cloudflare/wrangler

# login via your Cloudflare account
wrangler login

# find out your account ID
wrangler whoami

# at this point you will need to update `account_id` entry in wrangler.toml

# deploy to production
wrangler publish --env production
```
