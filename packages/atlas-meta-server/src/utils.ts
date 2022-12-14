import BN from 'bn.js'
import fetch from 'cross-fetch'
import parseHtml, { HTMLElement } from 'node-html-parser'

import { DataObjectFieldsFragment } from './api/__generated__/sdk'
import { AppData, MetaTags } from './types'

const DISTRIBUTOR_ASSET_PATH = 'api/v1/assets'

export const joinUrlFragments = (...fragments: string[]) => {
  const strippedFragments = fragments.map((f) => f.replace(/^\/|\/$/, ''))
  return strippedFragments.join('/')
}

export const generateAssetUrl = (asset: DataObjectFieldsFragment) => {
  const workingBuckets = asset.storageBag.distributionBuckets.filter((bucket) => bucket.distributing)
  const distributorsEndpoints = workingBuckets.reduce((acc, bucket) => {
    const endpoints = bucket.operators
      .filter((operator) => !!operator.metadata?.nodeEndpoint)
      .map((operator) => operator.metadata?.nodeEndpoint) as string[]
    return [...acc, ...endpoints]
  }, [] as string[])

  const assetIdBn = new BN(asset.id)
  const endpointsCountBn = new BN(distributorsEndpoints.length)
  const distributorIndex = assetIdBn.mod(endpointsCountBn).toNumber()
  const endpoint = distributorsEndpoints[distributorIndex]
  return joinUrlFragments(endpoint, DISTRIBUTOR_ASSET_PATH, asset.id)
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

export const applyMetaAndSchemaTagsToHtml = (html: HTMLElement, metaTags: MetaTags, schemaTags: string) => {
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
  head?.insertAdjacentHTML('beforeend', schemaTags)
}

export const fetchHtmlAndAppData = async (url: string): Promise<[HTMLElement, AppData]> => {
  // fetch and parse html
  const response = await fetch(url)
  const html = await response.text()
  const parsedHtml = parseHtml(html)

  // extract app data from the HTML
  const siteName = parsedHtml.querySelector('meta[name="og:site_name"]')?.getAttribute('content')

  if (!siteName) {
    throw new Error('Missing site name')
  }
  const orionUrl = parsedHtml.querySelector('meta[name="atlas:orion_url"]')?.getAttribute('content')
  if (!orionUrl) {
    throw new Error('Missing Orion URL in fetched HTML')
  }
  const appData: AppData = {
    name: siteName,
    orionUrl: orionUrl,
    twitterId: parsedHtml.querySelector('meta[name="twitter:site"]')?.getAttribute('content') || undefined,
  }

  return [parsedHtml, appData]
}
