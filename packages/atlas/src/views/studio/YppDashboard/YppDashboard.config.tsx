import { SvgTierIcon1, SvgTierIcon2, SvgTierIcon3 } from '@/assets/icons'
import { NumberFormat } from '@/components/NumberFormat'
import { atlasConfig } from '@/config'

const configTiers = atlasConfig.features.ypp.tiersDefinition?.tiers

export const TIERS = configTiers
  ? [
      {
        rules: (
          <>
            {'<'}
            <NumberFormat
              as="span"
              variant="t100"
              color="colorText"
              format="short"
              value={configTiers?.[1].minimumSubscribers || 0}
            />{' '}
            subscribers
          </>
        ),
        icon: <SvgTierIcon1 />,
        subscribers: configTiers?.[0].minimumSubscribers,
        multiplier: configTiers?.[0].multiplier,
      },
      {
        rules: (
          <>
            <NumberFormat
              as="span"
              variant="t100"
              color="colorText"
              format="short"
              value={configTiers?.[1].minimumSubscribers || 0}
            />
            -
            <NumberFormat
              as="span"
              variant="t100"
              color="colorText"
              format="short"
              value={configTiers?.[2].minimumSubscribers || 0}
            />{' '}
            subscribers
          </>
        ),
        icon: <SvgTierIcon2 />,
        subscribers: configTiers?.[1].minimumSubscribers,
        multiplier: configTiers?.[1].multiplier,
      },
      {
        rules: (
          <>
            {'> '}
            <NumberFormat
              as="span"
              variant="t100"
              color="colorText"
              format="short"
              value={configTiers?.[2].minimumSubscribers || 0}
            />{' '}
            subscribers
          </>
        ),
        icon: <SvgTierIcon3 />,
        subscribers: configTiers?.[2].minimumSubscribers - 1,
        multiplier: configTiers?.[2].multiplier,
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
      usdAmount: reward.baseUsdAmount,
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
