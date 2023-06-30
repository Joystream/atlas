# Atlas operator guide

## Table of contents

- [Basics](#basics)
  - [Introduction](#introduction)
  - [Prerequisites](#prerequisites)
  - [Running Atlas](#running-atlas)
  - [Configuring Atlas](#configuring-atlas)
    - [App name](#app-name)
    - [App logo](#app-logo)
    - [App favicon](#app-favicon)
    - [Categories](#categories)
    - [YouTube Partner Program](#youtube-partner-program)
    - [Terms of Service, Copyright Policy and Privacy Policy](#terms-of-service-copyright-policy-and-privacy-policy)
  - [Operating Atlas](#operating-atlas)
    - [Content blocking](#content-blocking)
    - [Kill switch](#kill-switch)
- [Required services](#required-services)
  - [Orion](#orion)
  - [Query Node](#query-node)
  - [RPC Node](#rpc-node)
  - [Member faucet](#member-faucet)
  - [Avatar service](#avatar-service)
- [Optional services](#optional-services)
  - [Social previews generation](#social-previews-generation)
  - [Price feed](#price-feed)
  - [Geolocation service](#geolocation-service)
  - [Captcha](#captcha)
- [Analytics](#analytics)
  - [Sentry](#sentry)
  - [Livesession](#livesession)
  - [Usersnap](#usersnap)
  - [Distribution logs](#distribution-logs)

## Basics

### Introduction

This guide will help you get started with running your own instance of Atlas (a "gateway"). Atlas is a frontend single page application that allows users to interact with the Joystream network - basic functionalities include watching and publishing content, managing channels, issuing and trading NFTs, and more. For a brief introduction on how Atlas works and what services it interacts with, you may want to start with the [architecture overview](./architecture.md). To run a gateway, you will need to host a publicly available deployment of the frontend app, but you will also need to run a few other services that Atlas depends on. We will walk you through the process of setting up all of these services.

**Tip:** Atlas provides built-in "admin tools" panel that can be useful when running your own instance. You can access it in the app by pressing Ctrl+Shift+D.

### Prerequisites

- Basic knowledge of how to use the command line, how to operate Docker, and how to host a web application
- Domain name (e.g. `example.com`) to make your gateway publicly available
- Server to deploy required services (e.g. VPS, dedicated server, or cloud instance)
- Some kind of web server (e.g. Nginx) or PaaS (e.g. Vercel) to host the frontend app

### Running Atlas

To begin with, let's ignore any customization and just run pre-configured version of Atlas. As explained in the [overview](./overview.md), Atlas repo has a monorepo structure, with multiple packages in the `packages/` directory. The main package is `atlas`, which contains the frontend application.

Once you have cloned the repo, you can run the app in development mode by running the following commands:

```bash
yarn install
yarn atlas:dev
```

While the dev mode is useful for development, it is not optimized for production. To run the app in production mode, you will need to build it first:

```bash
yarn atlas:build
```

This will create a production build of the app in the `packages/atlas/dist/` directory. You can then serve this directory using any web server, for demo purposes we will use the `serve` package:

```bash
yarn global add serve
serve -s -p 4200 packages/atlas/dist/
```

For production, you will want to use a more robust web server, such as Nginx. You can also use a PaaS such as Vercel, which will take care of building and hosting the app for you. You may find these resources useful:

- https://www.digitalocean.com/community/tutorials/how-to-deploy-a-react-application-with-nginx-on-ubuntu-20-04
- https://vercel.com/docs

### Configuring Atlas

Now that you know how to run a basic version of Atlas, let's take a look at how you can make your gateway unique and tune it to your needs. The first thing you will want to take a look at is the `atlas.config.yml` file located in `packages/atlas` directory. This is the main configuration file for the app, and it will allow you to change basic setting like app name. All the configuration options have a description, so should be fairly self-explanatory. This config file also supports environment variables, so you can provide values via env like so `appName: '$VITE_APP_NAME'` instead of hard-coding values into the config.

Second part of the configuration is passed via environment variables. You can find a list of all the available variables in the `packages/atlas/src/.env` file. You can either provide those via environment or just modify the `.env` file. If you take a look at the file, you will notice there's a couple of different section. Sections like `DEVELOPMENT_`, `NEXT_` and `LOCAL_` are useful only for Atlas development, so if you only want to run a production instance, you should be fine ignoring those additional sections and leaving values as they are.

**Note:** Whenever you change the config, you will need to rebuild the app and redeploy (see [Running Atlas](#running-atlas)).

#### App name

The most basic customization is changing the app branding. That includes app name and logo. Changing the name is as simple as changing the `general.appName` field in the config file. This will replace all the usage of "Atlas" in the app with your name.

#### App logo

Changing the logo is a bit more involved and itself consists of two steps. You will need to update the logo used in the app itself, but also the logo used in the browser favicon. To update the logo used in the app, you will need to prepare 3 versions of your logo in SVG format:

1. `app-logo-short.svg` - Just the logo of your app, without any text, in a square(ish) aspect ratio
2. `app-logo-full.svg` - The logo of your app, with the app name next to it. It should be 32 pixels high, width can vary
3. `app-logo-studio.svg` - Same as above, but instead of the app name, it should say "Studio" (or whatever else you desire). This is used in the Studio views.

Once you have those prepared, you should replace files with the same names located in `packages/atlas/src/assets/logos/svgs/` directory. You will also need to generate React components from those SVG files. To do that, run the following command:

```bash
yarn atlas:svgs:logos
```

After that, all the instances of Atlas logo in the app should be replaced.

#### App favicon

Once you update the logo used in the app, you should also update the favicon that browsers will use in the address bar. For that purpose, you will need to generate a couple of different versions of your logo. You can take a look at the `packages/atlas/src/public` directory to see what assets base version of Atlas uses. Our entrypoint is the `icon.svg` file which also contains built-in media query for light and dark themes. There are some tools online that can help with generating the favicons set, like this one: https://realfavicongenerator.net/ although they can generate a bunch of legacy stuff that's not really needed. You can also use this article as a reference: https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs

#### Categories

Atlas uses list of categories defined in `content.categories` config entry to determine which content categories should be handled by the app. Categories defined in that list are local to the app - they will be used in the
`Discover` screen and when the user is publishing new content. Each local (or "display") category also has a list of associated Query Node video categories that should be displayed inside it.

Atlas will, by default, only display content belonging to one of the defined display categories in the app. That means that video with a category that doesn't belong to any local category will not be available in the app. If you want to change that behavior, so app will display all the content regardless of the category, you can adjust this in Orion service.

You are free to use existing metaprotocol (Orion) categories, but you can also create your own that match your Gateway's specific needs. To get a list of all the existing categories you can use the following QN query:

```graphql
query {
  videoCategories(limit: 200) {
    id
    name
  }
}
```

You can also see the current categories used by specific Gateways in Apps WG Notion: https://joystream.notion.site/5b3afe994cd64c7d8144cd2978fa5ceb?v=639feb777c514c26b2d88869d67cabf8

To create a new QN category, you can use [Joystream CLI](https://github.com/Joystream/joystream/tree/master/cli):

```bash
joystream-cli content:createVideoCategory "My category" "My category description"
```

Once you run the above command, you can use the query above with a `orderBy: createdAt_DESC` argument to get the ID of the newly created category. You can then add it to the `content.categories` config entry.

#### YouTube Partner Program

All the YPP (YouTube Partner Program) parameters could be found in `atlas.config.yml` file located in `packages/atlas` directory.
`features.ypp` section contains all the necessary params for setting up [youtube-synch](https://github.com/Joystream/youtube-synch/) and customizing user's rewards.

Once youtube-synch is setup, you'll need to provide its API URL in `youtubeSyncApiUrl` variable.

In order to enable YPP content in atlas, `googleConsoleClientId` variable needs to be provided. You can read more about it [here](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid).

You are free to use existing metaprotocol (Query Node) categories, but you can also create your own that match your Gateway's specific needs. To get a list of all the existing categories you can use the following QN query:

```graphql
query {
  videoCategories(limit: 200) {
    id
    name
  }
}
```

You can also see the current categories used by specific Gateways in Apps WG Notion: https://joystream.notion.site/5b3afe994cd64c7d8144cd2978fa5ceb?v=639feb777c514c26b2d88869d67cabf8

To create a new QN category, you can use [Joystream CLI](https://github.com/Joystream/joystream/tree/master/cli):

```bash
joystream-cli content:createVideoCategory "My category" "My category description"
```

Once you run the above command, you can use the query above with a `orderBy: createdAt_DESC` argument to get the ID of the newly created category. You can then add it to the `content.categories` config entry.

In order to enable YPP content in atlas, `googleConsoleClientId` variable needs to be provided. You can read more about it [here](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid).

#### Environment variables

Atlas uses environment variables, so you can customize it for your specific needs. `.env` file is located in `/packages/atlas/src` directory.
Below is the list of all the variables used by Atlas with a short description:

`VITE_ENV` - used for making a production build

`VITE_ENV_SELECTION_ENABLED` - enables environment selection dropdown in the admin panel. Recommended to be set to `false` in production.

`VITE_DEFAULT_DATA_ENV` - if `VITE_ENV` is set to `true`, atlas will use `VITE_PRODUCTION_` URLs. Changing this variable can overwrite this.

`VITE_FORCE_MAINTENANCE` - Setting this to `true` will enable the maintenance mode. Orion has its own KillSwitch mechanism which will also enable maintenance mode for Atlas, but this variable can be used when Orion is down or temporarily unavailable.

`VITE_APP_ID` - id of the app for wrapping metadata. You can receive an Id by [creating an app](https://github.com/Joystream/joystream/tree/master/cli#joystream-cli-appscreateapp) in joystream-cli.

`VITE_APP_NAME` - name of the app for wrapping metadata.

`VITE_AVATAR_SERVICE_URL` - URL for avatar service - used to upload member's avatar.

`VITE_GOOGLE_CONSOLE_CLIENT_ID` - ID of your Google console client. Used to enable the [youtube-sync](https://github.com/Joystream/youtube-synch) service for YPP.

`VITE_YOUTUBE_SYNC_API_URL` - URL of your youtube-sync instance.

`VITE_YOUTUBE_COLLABORATOR_MEMBER_ID` -

`VITE_GA_ID` - Google Analytics ID. Used to enable Google Analytics.

`VITE_SEGMENT_ID` - Segment ID. Used to enable Segment analytics tool.

`VITE_SENTRY_DSN` - Sentry DSN. Used to enable Sentry error tracking.

`VITE_OPTIMIZE_ID` - Optimize ID. Used to enable Google Optimize.

`VITE_USERSNAP_ID` - Usersnap ID. Used to enable Usersnap.

`VITE_{environment}_ORION_URL` - Orion URL. See [Orion](#orion) section for more info.

`VITE_{environment}_QUERY_NODE_SUBSCRIPTION_URL` - Orion's Query Node URL. See [Query Node](#query-node) section for more info.

`VITE_{environment}_NODE_URL` - RPC Node URL. See [RPC Node](#rpc-node) section for more info.

`VITE_{environment}_FAUCET_URL` - Faucet URL. See [Member Faucet](#member-faucet) section for more info.

#### Terms of Service, Copyright Policy and Privacy Policy

You can provide your own Terms of Service, Copyright Policy and Privacy Policy by updating the `legal.termsOfService`, `legal.copyrightPolicy` and `legal.privacyPolicy` config entries. All of these support basic Markdown syntax like headings and lists.

### Operating Atlas

#### Content blocking

Atlas will not display any content censored by the Joystream DAO (i.e. content marked with `isCensored: true`). However, you can also block additional content as the app operator. To do so, you can use `blockedDataObjectIds`, `blockedVideoIds` and `blockedChannelIds` config entries under `content.` group. Adding an ID to any of those will block respective content from being displayed in the app.

#### Kill switch

In case you need to take the app down for maintenance or any other reason, Atlas provides a "kill switch" mechanism that can be triggered by its operator. Enabling it will make all the users that visit the app see a "maintenance" page instead of the actual app. To enable/disable kill switch, you can use Atlas admin tools (opened with Ctrl+Shift+D in app) and navigating to "Kill switch" tab. There you can enable/disable the kill switch by providing Orion's admin secret.

## Required services

Going through the previous section, your Atlas app should be configured and running. However, there are some services that the app relies on and won't be able to operate without them. In this section we will go through all of those required services.

### Orion

Orion is the main backend service for Atlas - providing indexed blockchain data and sprinkling some additional information on top. It can be seen as a "Gateway node", providing everything needed for the end user and app operator. You can find more info about Orion in [architecture overview](./architecture.md#orion). Each gateway should run its own instance of Orion, and it should be publicly available. You can find the source code for Orion in [its repo](https://github.com/Joystream/orion). The README file in the repository provides an overview of Orion's features and basic instructions on how to run it. URL to your Orion's instance `/graphql` endpoint should be passed to the `VITE_PRODUCTION_ORION_URL` environment variable.

### Query Node

Query Node (QN) is a service that processes blockchain events and stores them in a database. Orion v2 has it's own Query Node included by default, so you don't need to run it separately. However, if you are running Orion v1, you will need to run QN separately. You can find more information about QN in [its repo](https://github.com/Joystream/joystream/tree/master/query-node).

### RPC Node

RPC nodes are Joystream blockchain nodes that are responsible for running the network. Whether you need your own instance of RPC node depends on your setup. If you are running your own QN, you probably also want to run RPC node alongside for speed of synching and indexing. If you make that RPC endpoint public, you can pass it as `VITE_PRODUCTION_NODE_URL` environment variable, meaning that all user-initiated transactions would be sent to your RPC node. However, you can also use a publicly available node, like `wss://rpc.joystream.org:9944`.

### Member faucet

Member faucet is a service that creates free memberships for Atlas users when they sign up. You can find more information about this service in [its repo](https://github.com/Joystream/membership-faucet/tree/carthage). Instructions in README should be enough to configure and run your own instance. You will need to provide the URL to the faucet's `/register` endpoint as `VITE_PRODUCTION_FAUCET_URL` environment variable.

### Avatar service

Avatar service is used for uploading avatars of members registered via Atlas instance. Joystream membership system is currently not connected with the storage system, meaning that only avatar URLs are accepted. To make user lives easier, Atlas will use Avatar service to upload those avatars and access them later. Code for that service is available in `packages/atlas-avatar-service` directory. It is also available in Dockerhub as `joystream/atlas-avatar-service`. You should most likely run your own instance, but it's also possible to use default one operated by Jsgenesis. Upload endpoint for that service should be passed as `features.members.avatarServiceUrl` config entry.

## Optional services

Apart from above required services, there are a couple of optional ones that you may want to use to improve user's experience.

### Social previews generation

Social previews are images that are generated when a user shares a link to a video or a channel. They are used by social media platforms to display a preview of the content. However, generating rich previews with an SPA like Atlas it not trivial. You can find more info about this issue and possible solutions in [overview](./overview.md#meta-tags-pre-rendering).

### Price feed

One of optional features of the Atlas interface is showing estimated values in USD wherever JOY prices are used. To do that, you need to provide a price feed endpoint that returns a JSON with a single `price` field that contains the current price of JOY in USD. There is currently no service that provides such a feed, so you will need to run your own solution. The URL for that endpoint can be passed via `joystream.tokenPriceFeedUrl` config entry.

### Geolocation service

To ensure the best possible user experience, Atlas will try to determine the user's location and use it to select content distributors physically close to the user. To do that, it uses a geolocation service that returns a JSON with `latitude` and `longitude` fields. While this is optional, it's highly recommended to enable this functionality as it will have big impact on the user experience. One of the possible solutions for this kind of service has been described in [the overview](./overview.md#selecting-distributors). If you don't want to run your own instance, you can use Jsgenesis-operated service at `https://geolocation.joystream.org`. The URL for that endpoint can be passed via `storage.geolocationServiceUrl` config entry.

### Captcha

To prevent draining the faucet, Atlas can use a captcha service to verify that the user is a human when they are creating their membership. Whether you need captcha, depends on the configuration of the faucet you are using. If the faucet requires captcha (as defined in Faucet's config), you will need to provide HCaptcha site key for Atlas to use. This should be passed as `features.members.hcaptchaSiteKey` environment variable. You can read more about HCaptcha in [their docs](https://docs.hcaptcha.com/).

## Analytics

Atlas integrates a couple of services for product/user analytics. Those can be very helpful in understanding how your users are using the app and what they are interested in. All of those services are optional and can be disabled.

### Sentry

Sentry is a service that collects errors and exceptions that happen in the app. It will keep track of what's going on in your app and notify you when something goes wrong. You can find more info about Sentry in [their docs](https://docs.sentry.io/). To enable Sentry, you need to provide a DSN (identifier) which can be found in your Sentry project settings. This should be passed as `analytics.sentry.dsn` config entry. To disable Sentry, you can set `analytics.sentry.dsn` to `null` or remove `analytics.sentry` section from the config entirely.

### Livesession

Livesession is a service that collects information about user sessions. It's a good way to keep track of how many users are using your app and what they are doing. You can find more info about Livesession in [their docs](https://developers.livesession.io/). To enable Livesession, you need to provide an ID, which you can find in your Livesession project settings. This should be passed as `analytics.livesession.id` config entry. To disable Livesession, you can set `analytics.livesession.id` to `null` or remove `analytics.livesession` section from the config entirely.

Also, if you want to enable cross-subdomain tracking, you can provide `analytics.livesession.rootHostname` config entry with the root domain name. You can find more info about it [here](https://livesession.io/help/how-to-track-users-across-multiple-subdomains/).

### Usersnap

Usersnap is a service that allows users to report bugs and issues directly from the app. It's a good way to get feedback from your users and to improve your app. You can find more info about Usersnap on [their website](https://usersnap.com). To enable Usersnap, you need to provide an ID, which you can find in your Usersnap project settings. This should be passed as `analytics.usersnap.id` config entry. To disable Usersnap, you can set `analytics.usersnap.id` to `null` or remove `analytics.usersnap` section from the config entirely.

### Distribution logs

Atlas also has a built-in mechanism for collecting end-user statistics on distributors' performance. Various response times will be collected for each asset and can then be uploaded to an assets logs service. The service should accept a JSON with a single `events` field that contains an array of events. Each event will contain a `type` field used to determine different type of events. If you want to use asset logs, you need to pass the URL of the service as `analytics.assetLogs.url` config entry.
