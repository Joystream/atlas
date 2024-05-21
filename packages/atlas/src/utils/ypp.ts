import { atlasConfig } from '@/config'
import { YppChannelStatus } from '@/views/global/YppLandingView/YppLandingView.types'

const configTiers = atlasConfig.features.ypp.tiersDefinition
type ConfigTier = (typeof configTiers)[number]['tier']

export const yppBackendTierToConfig = (beTier?: YppChannelStatus): ConfigTier | undefined => {
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

type YppRewards = {
  signUp: number
  videoSync: number
  referral: number
}

export const getTierRewards = (tier?: ConfigTier): YppRewards | undefined => {
  const tierRewards = configTiers.find((configTier) => configTier.tier === tier)?.rewards
  if (!tierRewards) return undefined
  return {
    signUp: tierRewards[0],
    videoSync: tierRewards[1],
    referral: tierRewards[2],
  }
}

export const BOOST_TIMESTAMP = 1698796800000 // 2023-11-01T00:00:00.000Z
