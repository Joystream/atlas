# Atlas Cloudflare Worker

This repository contains code for deploying a [Cloudflare Worker](https://developers.cloudflare.com/workers/) that can be used to enable social previews generation for an Atlas instance. For an overview of this feature, see [a section in docs](../../docs/overview.md#meta-tags-pre-rendering). Cloudflare Worker can act as an entrypoint, as an alternative to Nginx config provided in `ci/` directory, that will redirect social media crawlers to an instance of `atlas-meta-server`.

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
