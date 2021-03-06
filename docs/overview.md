# Atlas overview

Atlas is a content consumption and publication app for the Joystream platform. This document outlines conventions/tools/services used to make Atlas work.

## Conventions

### Some of the used tools/tech

- React
- Typescript
- GraphQL (+ [Relay-style pagination](https://graphql.org/learn/pagination/))
- ESLint, Prettier - for enforcing common code style
- [Mirage JS](https://miragejs.com/) - for [client-side mocking](#client-side-data-mocking)
- [Emotion](https://emotion.sh/) - for all the styling
- [Apollo Client](https://www.apollographql.com/docs/react/) - for communications with GraphQL-based external services


### Repo structure

- `.github/` - GitHub stuff - currently PR checks actions
- `docs/` - developer documentation
- `public/` - static assets used to build the app
- `scripts/` - some helper scripts for common tasks
- `config-overrides.js` - rules to modify CRA config with `customize-cra`
- `src/` - the source code
    - `api/` - everything related to integrations with external services
    - `assets/` - assets to be used from withing source code - images/fonts/etc.
    - `components/` - components specific to Atlas
    - `config/` - everything related to config - route URLs, env variables, etc.
    - `mocking/` - [client-side mocking](#client-side-data-mocking)
    - `shared/` - [reusable code](#shared-folder)
      - `components` - reusable components
      - `theme` - all the theme stuff used by Atlas
    - `styles/` - app wide styles
    - `types/` - global Typescript related code
    - `utils/` - common utilities - e.g. for formatting dates etc.
    - `views/` - all the top-level views displayed by the router
    - `index.tsx` - app entry-point
    - `App.tsx` - React entry-point

### Shared folder

Historically, Atlas codebase was split between two packages - `app` and `@joystream/components`. Due to build process and developer experience issues it was decided to merge those packages into one until the separation is actually needed. Hence the `shared/` directory in `src/`. This folder is what used to be `@joystream/components` and it's intended to be application-agnostic. That means no Atlas-specific logic (like routing) should be put there, only atomic UI components.

### DevOps

We currently use GitHub actions and Netlify for all our DevOps needs. On every PR we run GitHub actions to ensure the code follows the linting rules. Also, for every PR, Netlify previews are generated so that it's easy to explore the updated app.

The deployed version of Atlas (at https://play.joystream.org) is also hosted by Netlify. This one gets redeployed on every push/merge to master.

## Data sources

Joystream is a decentralized platform so there cannot be a permissioned backend for all the Atlas querying/persistence needs. Instead, Atlas uses the following sources for its data.

_Note that URLs for accessing all of the following services are provided to Atlas via build-time env variables (set in Netlify, accessed in `src/config/urls.ts`)._

### Query node (content directory)

At the base level, all the metadata about content in the Joystream platform (videos, channels, etc.) is persisted inside the Joystream blockchain in what is called a content directory. However, querying data from a blockchain directly is quite difficult - it only offers a low-level API and will not allow easy filtering/sorting and other higher-level functionalities you'd expect from an API. To alleviate that there is an intermediary layer called "query node". A query node constantly indexes data saved in the blockchain to provide an easy to use GraphQL API for Atlas. Currently deployed query node can be found [here](https://hydra.joystream.org/graphql). This is where Atlas gets all the information about videos and channels to display.

Note that there is only one query node used by Atlas at the moment, and it's the one hosted by Jsgenesis. In the future, there will be a number of query nodes operated independently.

_Source code:_ https://github.com/Joystream/hydra

### Orion

Even though the query node serves most of Atlas' data needs, it'd be impractical to save all the necessary data into the blockchain. Actions like increasing a video's view count shouldn't require user authentication and happen in background, which makes them a poor match for saving in the blockchain. To allow functionalities like this to exist, another service was created - Orion. Orion is a trusted and trusting service at the moment - it doesn't verify the data supplied to it and Atlas doesn't verify the data it gets from Orion. Anyone can read the data from Orion and modify it using GraphQL. This is a temporary solution and will need to be addressed at some point. The currently deployed instance of Orion can be found [here](https://orion.joystream.org/graphql).

Currently Orion saves:
- video view counts
- aggregated channel view counts
- channel followers counts

_Source code:_ https://github.com/Joystream/orion

### Storage node

Even though all the video metadata is saved inside the content directory (blockchain), the same cannot be done for the actual video files. Those get huge and saving them to the blockchain would be just too expensive. This is what Storage Providers (see https://www.joystream.org/roles -> Storage Provider) help with. They run storage nodes that are responsible for storage and distribution of assets. Atlas uses storage nodes to fetch assets using identifiers stored in the content directory.

_Source code:_ https://github.com/Joystream/joystream/tree/master/storage-node

## Data handling

### Client-side data stitching

To display information about a video in Atlas, data from 2 data sources is required:
- All the metadata from the query node (content directory)
- Views count from Orion

We could treat those sources as separate, but they describe the same asset - one specific video, just with some data fragmentation. To allow not having to worry about where each piece of data comes from as a consumer, a technique called client-side schema stitching is used. This allows writing client-side resolvers that stitch the data from different sources into one output object. When a video is fetched from some kind of view, both the data from the query node and Orion will be requested and merged automatically.

_Source code:_ https://github.com/Joystream/atlas/blob/master/src/api/client/resolvers.ts

### Client-side data mocking

During development, it may be useful to have an ability to use mocked data for a couple of reasons:
- required functionality is not ready in a given service yet,
- testing specific kinds of data,
- infrastructure is down.

To allow that, Atlas uses Mirage JS for client-side mocking. The way this works, when the mocking module gets imported, Mirage creates a local server that intercept all the XHR network requests. Unless the request URL is explicitly marked as passthrough, Mirage will try to resolve that request using defined mocked handlers. We have handlers for most of the query node functionality that allow us to run Atlas independently of any infra with its own set of data.

#### Mocked dataset

All the raw mocked data presented in Atlas can be found in `src/mocking/data/raw`. These JSON files are then parsed and returned by Mirage JS on GraphQL requests.

The raw data can be generated by using included scripts:

- `yarn mocking:videos`
- `yarn mocking:channels`
- `yarn mocking:videosMedia` - this creates the metadata for provided video files. To do so, all the video files have to be placed inside `scripts/mocking/videos`.

The scripts will generate new data and automatically place it inside the codebase.

#### Mocked assets

Mocked assets for Atlas are hosted on the Linode object storage provided by Jsgenesis.

The storage is S3-compatible and can be accessed with any S3 client. The endpoint is `eu-central-1.linodeobjects.com` and a generated keypair must be used to access it.

Example on how to configure `s3cmd` client for access can be found [here](https://www.linode.com/docs/platform/object-storage/how-to-use-object-storage/#s3cmd).

When inside a directory with all the assets, you can run `s3cmd sync --acl-public . s3://atlas-assets` to sync your local directory with the remote storage.

