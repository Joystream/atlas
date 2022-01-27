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
      - `index.html` - main template
      - `index.ts` - server entry point


### DevOps

We currently use GitHub actions and Vercel for all our DevOps needs. On every PR we run GitHub actions to ensure the code follows the linting rules. Also, for every PR, Vercel previews are generated so that it's easy to explore the updated app.

The deployed version of Atlas (at https://play.joystream.org) is also hosted by Vercel. This one gets redeployed on every push/merge to master.

## Meta tags pre-rendering

Because social media crawling bots can't handle SPA apps, we decided to pre-render html meta tags for social media previews purposes.
Whenever user agent comes from social media bot, we serve pre rendered html, in any other case regular application is served.

To run `atlas-meta-server`:
```bash
cd ci
./build-docker-atlas.sh
./build-docker-meta-server.sh
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
