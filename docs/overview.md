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

### Monorepo

Please note that this repo is based on [Yarn Workspaces](https://yarnpkg.com/features/workspaces) and because of that, to install new dependency from root, you need to use the following pattern: `yarn workspace [package_name] add [dependency_name]`. You also have the option to install dependencies directly from package directory using `yarn add [package_name]`

### Repo structure

- `.github/` - GitHub stuff - currently PR checks actions
- `ci/` - continuous integration stuff
  - `nginx/` - nginx config directory
  - `build-docker-atlas.sh` - build script for atlas app Docker
  - `build-docker-meta-server.sh` - build script for meta server Docker
  - `docker-compose.yml` - docker compose for meta server Dockers
- `docs/` - Atlas-related documentation - technical & community
- `packages/` - workspace apps
  - `atlas/` - main app
    - `.storybook/` - Storybook configuration
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
  - `atlas-meta-server` - meta tags pre-rendering server
  - `atlas-cloudflare-worker` - Cloudflare Worker to enable Atlas social previews on Cloudflare edge network

### DevOps

We currently use GitHub actions and Vercel for all our DevOps needs. On every PR we run GitHub actions to ensure the code follows the linting rules. Also, for every PR, Vercel previews are generated so that it's easy to explore the updated app.

The deployed version of Atlas (at https://play.joystream.org) is also hosted by Vercel. This one gets redeployed on every push/merge to master.

## Meta tags pre-rendering

Because social media crawling bots can't handle SPA apps, we decided to pre-render HTML meta tags for social media previews purposes. Whenever a request from a social media crawler (detected via `User-Agent` header), we redirect it to the `atlas-meta-server` which returns pre-rendered HTML, in any other case regular application is served.

There are 2 methods of handling the incoming traffic and redirecting:

1. For self-hosted version of Atlas - docker-compose setup located in `ci/` directory. This will run docker-compose with NGINX that redirects any incoming traffic. Social crawlers' requests get sent to `atlas-meta-server` instance, and otherwise static files are served.
2. For jsgenesis-run Atlas production instance - Cloudflare Worker setup located in `packages/atlas-cloudflare-worker`. This method uses [Cloudflare Workers](https://workers.cloudflare.com/) that runs redirection logic on Cloudflare edge network, allowing redundancy and very fast response times. If the request is a regular one, it gets redirected to Vercel deployment.

To build and run `atlas-meta-server` for production:

```bash
yarn docker:meta-server
docker run -e GRAPHQL_URL=https://orion.joystream.org/graphql -p 80:80 -d joystream/atlas-meta-server
```

To run full self-hosted setup:

```bash
yarn docker:atlas
yarn docker:meta-server
cd ci
docker-compose up -d
```

## Architecture

For full technical overview of Atlas architecture, see [architecture.md](architecture.md).

## Styling

All styles for components/views used in Atlas should use design tokens defined by the designers. You can find the raw tokens [inside the atlas-resources repo](https://github.com/Joystream/atlas-resources/tree/main/design_tokens). The tokens define things like colors, typography, borders, etc. There is a script called `tokens` (`yarn tokens`) that will fetch the latest tokens from the resources repo and build them into usable CSS variables. Then in any place in the code you can import the `cVar` function from `@/styles` and use any of the tokens. Example:

```tsx
import { cVar } from '@/styles'

const Component = styled.div`
  background-color: ${cVar('colorBackground')}; // this will translate into var(--color-background)
`
```

## Icons & illustrations

Atlas uses a bunch of different SVG files for icons and illustrations. All of those are pre-processed via a `yarn svgs:illustrations` / `yarn svgs:icons-generate` script that generates React components out of SVGs using [svgr](https://github.com/gregberge/svgr). Then we import those components inside our code.

All icons used in the app are created by the Atlas design team and come from Figma. To make the workflow easier, we have created a script that fetches all the icons directly from Figma and saves them in the repo. This way we can make always keep Figma and the app up to date. The script can be found in `scripts/figma-import` and can be run with `yarn svgs:icons-import`.
