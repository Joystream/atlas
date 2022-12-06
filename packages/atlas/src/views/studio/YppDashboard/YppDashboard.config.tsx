import { SvgTierIcon1, SvgTierIcon2, SvgTierIcon3 } from '@/assets/icons'
import { atlasConfig } from '@/config'
import { formatNumber } from '@/utils/number'

const configTiers = atlasConfig.features.ypp.tiersDefinition?.tiers

export const TIERS = configTiers
  ? [
      {
        rules: `<${formatNumber(configTiers?.[1].minimumSubscribers)} subscribers`,
        icon: <SvgTierIcon1 />,
        subscribers: configTiers?.[0].minimumSubscribers,
      },
      {
        rules: `${formatNumber(configTiers?.[1].minimumSubscribers)}-${formatNumber(
          configTiers?.[2].minimumSubscribers
        )} subscribers`,
        icon: <SvgTierIcon2 />,
        subscribers: configTiers?.[1].minimumSubscribers,
      },
      {
        rules: `>=${formatNumber(configTiers?.[2].minimumSubscribers)} subscribers`,
        icon: <SvgTierIcon3 />,
        subscribers: configTiers?.[2].minimumSubscribers,
      },
    ]
  : []

const configRewards = atlasConfig.features.ypp.rewards

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
      actionButton: {
        text: reward.actionButtonText,
        ...(reward.actionButtonAction === 'isRefer' ? { isRefer: true } : { to: reward.actionButtonAction }),
      },
    })) || []
