import fetch from 'cross-fetch'
import parseHtml, { HTMLElement } from 'node-html-parser'

import { DataObjectFieldsFragment } from './api/__generated__/sdk'
import { AppData, MetaTags } from './types'

export const joinUrlFragments = (...fragments: string[]) => {
  const strippedFragments = fragments.map((f) => f.replace(/^\/|\/$/, ''))
  return strippedFragments.join('/')
}

export const generateAssetUrl = (asset: DataObjectFieldsFragment) => {
  return asset.resolvedUrls[0]
}

export const getEnvVariable = (varName: string, required?: boolean) => {
  if (!process.env[varName] && required) {
    // eslint-disable-next-line no-console
    console.error(`Missing required ${varName} env variable`)
    process.exit(1)
  }
  return process.env[varName] || ''
}

export const generateMetaHtml = (tags: MetaTags, addHelmetAttr = false) => {
  return Object.entries(tags)
    .map(
      ([name, content]) =>
        `<meta name="${name}" property="${name}" content="${content}" ${
          addHelmetAttr ? 'data-react-helmet="true"' : ''
        }>`
    )
    .join('\n')
}

export const applyMetaTagsToHtml = (html: HTMLElement, metaTags: MetaTags) => {
  // remove already present meta tags
  const metaTagsLookup = Object.keys(metaTags).reduce<Record<string, boolean>>((acc, key) => {
    acc[key.toLowerCase()] = true
    return acc
  }, {})
  const metaTagsToRemove = html.querySelectorAll('meta').filter((metaTag) => {
    const name = metaTag.getAttribute('name') || metaTag.getAttribute('property')
    return name && metaTagsLookup[name.toLowerCase()]
  })
  metaTagsToRemove.forEach((metaTag) => metaTag.remove())

  // add new meta tags
  const head = html.querySelector('head')
  const metaTagsHtml = generateMetaHtml(metaTags)
  head?.insertAdjacentHTML('beforeend', metaTagsHtml)
}

export const applySchemaTagsToHtml = (html: HTMLElement, schemaTags: string) => {
  const head = html.querySelector('head')
  head?.insertAdjacentHTML('beforeend', schemaTags)
}

export const fetchHtmlAndAppData = async (url: string): Promise<[HTMLElement, AppData]> => {
  // fetch and parse html
  const response = await fetch(url)
  const html = await response.text()
  const parsedHtml = parseHtml(html)

  const getMetaTagContent = (name: string) => {
    const metaTag = parsedHtml.querySelector(`meta[name="${name}"]`)
    return metaTag?.getAttribute('content')
  }

  // extract app data from the HTML
  const siteName = getMetaTagContent('og:site_name')

  if (!siteName) {
    throw new Error('Missing site name')
  }
  const orionUrl = getMetaTagContent('atlas:orion_url')
  if (!orionUrl) {
    throw new Error('Missing Orion URL in fetched HTML')
  }
  const appData: AppData = {
    name: siteName,
    orionUrl: orionUrl,
    twitterId: getMetaTagContent('twitter:site'),
    yppOgTitle: getMetaTagContent('atlas:ypp_og_title'),
    yppOgDescription: getMetaTagContent('atlas:ypp_og_description'),
    yppOgImage: getMetaTagContent('atlas:ypp_og_image'),
  }

  return [parsedHtml, appData]
}
