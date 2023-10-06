import { atlasConfig } from '@/config'

const configTiers = atlasConfig.features.ypp.tiersDefinition
const configRewards = atlasConfig.features.ypp.rewards

export const getTierRewards = (tier: string): number[] | undefined => {
  // [signup, video sync, referral]
  return configTiers.find((configTier) => configTier.tier === tier)?.rewards
}

type RewardWithDescription = NonNullable<typeof configRewards>[number] & {
  stepsDescription: string
  actionButtonText: string
  showInDashboard: true
}

export const REWARDS =
  configRewards
    ?.filter(
      (reward): reward is RewardWithDescription =>
        !!(reward.stepsDescription || reward.actionButtonText || reward.showInDashboard)
    )
    .map((reward) => ({
      title: reward.title,
      description: reward.stepsDescription,
      steps: reward.steps,
      joyAmount: reward.baseAmount,
      usdAmount: reward.baseUsdAmount,
      customMultiplier: reward.customMultiplier,
      ...(reward.actionButtonText
        ? {
            actionButton: {
              text: reward.actionButtonText,
              ...(reward.actionButtonAction === 'copyReferral'
                ? { copyReferral: true }
                : { to: reward.actionButtonAction }),
            },
          }
        : {}),
    })) || []
