import { load as loadYaml } from 'js-yaml'
import fs from 'node:fs'
import path from 'node:path'
import { PluginOption, loadEnv } from 'vite'

// we need to use relative import from atlas-meta-server because of an issue in Vite: https://github.com/vitejs/vite/issues/5370
import { generateCommonMetaTags } from '../../atlas-meta-server/src/tags'
import { generateMetaHtml } from '../../atlas-meta-server/src/utils'
import { configSchema } from '../src/config/configSchema'

// read config file - we cannot use `@/config` since it relies on YAML plugin being already loaded and that's not done in this context
const rawConfigPath = path.resolve(__dirname, '..', 'atlas.config.yml')
const rawConfigText = fs.readFileSync(rawConfigPath, 'utf-8')
const rawConfig = loadYaml(rawConfigText)
const parsedConfig = configSchema.parse(rawConfig)

// This plugin fixes https://github.com/Joystream/atlas/issues/3005
// By default vite was transpiling `import.meta.url` (that you can find in `node_modules/@polkadot/api/packageInfo.js`)
// to the code which uses `document.baseURI`. `Document` is not available in workers and in the result we got reference errors.
// This plugin replace `document.baseURI` with `self.location.href` which should be available in the worker
export const PolkadotWorkerMetaFixPlugin: PluginOption = {
  name: 'resolve-import-meta-polkadot',
  resolveImportMeta(_, { chunkId }) {
    if (chunkId.includes('polkadot-worker')) {
      return 'self.location.href'
    }
  },
}

// This plugin overrides the name property in manifest.webmanifest file
export const AtlasWebmanifestPlugin: PluginOption = {
  name: 'atlas-webmanifest',
  buildStart() {
    const inputManifestPath = path.resolve('src/public/manifest.webmanifest')
    const manifestData = JSON.parse(fs.readFileSync(inputManifestPath, `utf-8`))

    Object.assign(manifestData, {
      name: parsedConfig.general.appName,
    })

    try {
      this.emitFile({
        type: 'asset',
        source: JSON.stringify(manifestData, null, 2),
        fileName: path.normalize('manifest.webmanifest'),
      })
    } catch (err) {
      throw new Error('Failed to emit asset file, possibly a naming conflict?')
    }
  },
}

// This plugin replaces <meta-tags /> in index.html with the actual meta tags
export const AtlasHtmlMetaTagsPlugin: PluginOption = {
  name: 'atlas-html-meta-tags',
  transformIndexHtml: {
    enforce: 'pre',
    transform: (html: string) => {
      const metaTags = generateCommonMetaTags(
        parsedConfig.general.appName,
        parsedConfig.general.appUrl,
        parsedConfig.general.appName,
        parsedConfig.general.appDescription,
        parsedConfig.general.appOgImgPath,
        parsedConfig.general.appTwitterId
      )
      const titleHtml = `<title>${parsedConfig.general.appName}</title>`
      const metaHtml = generateMetaHtml(metaTags, true)

      // include link to Orion GraphQL API so that atlas-meta-server can use it to fetch data for content previews
      const orionUrlEnvKey = 'VITE_PRODUCTION_ORION_URL'
      const orionUrl =
        process.env[orionUrlEnvKey] || loadEnv('production', path.join(process.cwd(), 'src'))[orionUrlEnvKey]

      const generateMetaTagHtml = (name: string, content: string) =>
        `<meta name="${name}" property="${name}" content="${content}">`

      const orionMetaHtml = generateMetaTagHtml('atlas:orion_url', orionUrl)

      const yppOgTitleMetaHtml =
        parsedConfig.features.ypp.landingPageOgTitle &&
        generateMetaTagHtml('atlas:ypp_og_title', parsedConfig.features.ypp.landingPageOgTitle)
      const yppOgDescriptionMetaHtml =
        parsedConfig.features.ypp.landingPageOgDescription &&
        generateMetaTagHtml('atlas:ypp_og_description', parsedConfig.features.ypp.landingPageOgDescription)
      const yppOgImageMetaHtml =
        parsedConfig.features.ypp.landingPageOgImgPath &&
        generateMetaTagHtml('atlas:ypp_og_image', parsedConfig.features.ypp.landingPageOgImgPath)

      const finalMetaHtml = [
        titleHtml,
        metaHtml,
        orionMetaHtml,
        yppOgTitleMetaHtml,
        yppOgDescriptionMetaHtml,
        yppOgImageMetaHtml,
      ]
        .filter((v) => v)
        .join('\n')
      return html.replace('<meta-tags />', finalMetaHtml)
    },
  },
}

// This plugin enables /embedded path in development mode.
// Without this, dev server will always try to serve main index.html file
export const EmbeddedFallbackPlugin: PluginOption = {
  name: 'embedded-fallback',
  configureServer(server) {
    server.middlewares.use('/embedded', (req, res, next) => {
      if (req.url?.includes('.')) {
        next()
        return
      }
      req.url = '/index.html'
      req.originalUrl = '/embedded/index.html'
      next()
    })
  },
}

export const OptimizePlugin: PluginOption = {
  name: 'optimize-init-plugin',
  transformIndexHtml: {
    enforce: 'pre',
    transform: (html) => {
      const optimizeEnv = 'VITE_OPTIMIZE_ID'
      const optimizeId = process.env[optimizeEnv]
      const optimizeScript = optimizeId
        ? `<script src="https://www.googleoptimize.com/optimize.js?id=${optimizeId}"></script>`
        : ''

      return html.replace('<optimize-script />', optimizeScript)
    },
  },
}
