import { atlasConfig } from '@/config'
import { YppChannelStatus } from '@/views/global/YppLandingView/YppLandingView.types'

const configTiers = atlasConfig.features.ypp.tiersDefinition
type ConfigTier = typeof configTiers[number]['tier']

export const yppBackendTierToConfig = (beTier: YppChannelStatus): ConfigTier | undefined => {
  switch (beTier) {
    case 'Verified::Bronze':
      return 'bronze'
    case 'Verified::Silver':
      return 'silver'
    case 'Verified::Gold':
      return 'gold'
    case 'Verified::Diamond':
      return 'diamond'
    default:
      return undefined
  }
}

export const getTierRewards = (tier?: ConfigTier): number[] | undefined => {
  // [signup, video sync, referral]
  console.log('t', tier, configTiers)
  return configTiers.find((configTier) => configTier.tier === tier)?.rewards
}
