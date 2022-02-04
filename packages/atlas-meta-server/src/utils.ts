import BN from 'bn.js'

import { DataObjectFieldsFragment } from './api/__generated__/sdk'

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
