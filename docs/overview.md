# Atlas technical overview

This document tries to outline all the conventions/tools/services used to make Atlas work.

## Conventions

### Some of the used tools/tech

- React
- Typescript
- GraphQL (+ [Relay-style pagination](https://graphql.org/learn/pagination/)) with [Apollo Client](https://www.apollographql.com/docs/react/)
- Prettier, ESLint, Stylelint - for enforcing common code style
- [Emotion](https://emotion.sh/) - for all the styling
- [Zustand](https://github.com/pmndrs/zustand) - for simple local state management

### Repo structure

- `.github/` - GitHub stuff - currently PR checks actions
- `.storybook/` - Storybook configuration
- `docs/` - Atlas-related documentation - technical & community
- `public/` - static assets used to build the app
- `scripts/` - some helper scripts for common
- `src/` - the source code
  - `api/` - everything related to integrations with external services
  - `assets/` - assets to be used from within the source code - images/animations/etc.
  - `components/` - components used by Atlas
  - `config/` - everything related to config - route URLs, env variables, etc.
  - `hooks/` - hooks for reusable functionalities
  - `joystream-lib/` - code for interacting with the Joystream blockchain
  - `providers/` - contexts, stores and logic for different features
  - `styles/` - theme for styling the app - design tokens, global styles
  - `types/` - global Typescript related code
  - `utils/` - common utilities - e.g. for formatting dates etc.
  - `views/` - all the top-level views displayed by the router
  - `main.tsx` - app entry-point
  - `App.tsx` - React entry-point

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

Currently, Orion saves:

- video view counts
- aggregated channel view counts
- channel followers counts
- IDs of featured content, handled by the community, see more [here](community/featured-content.md)

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

## Styling

All styles for components/views used in Atlas should use design tokens defined by the designers. You can find the raw tokens [inside the atlas-resources repo](https://github.com/Joystream/atlas-resources/tree/main/design_tokens). The tokens define things like colors, typography, borders, etc. There is a script called `tokens` (`yarn tokens`) that will fetch the latest tokens from the resources repo and build them into usable CSS variables. Then in any place in the code you can import the `cVar` function from `@/styles` and use any of the tokens. Example:

```tsx
import { cVar } from '@/styles'

const Component = styled.div`
  background-color: ${cVar('colorBackground')}; // this will translate into var(--color-background)
`
```
