import { atlasConfig } from '@/config'

// const configTiers = atlasConfig.features.ypp.tiersDefinition?.tiers

// const tiersIcons = [
//   <SvgTierIcon1 key="1" />,
//   <SvgTierIcon2 key="2" />,
//   <SvgTierIcon3 key="3" />,
//   <SvgTierIcon4 key="4" />,
//   <SvgTierIcon5 key="5" />,
//   <SvgTierIcon6 key="6" />,
// ]

// export const TIERS = configTiers
//   ? configTiers.map((tier, index) => ({
//       rules: (
//         <div>
//           {index === 0 && '< '}
//           {index === configTiers.length - 1 && '> '}
//           <NumberFormat
//             as="span"
//             variant="t100"
//             color="colorText"
//             format="short"
//             value={tier.minimumSubscribers || 0}
//           />
//           {index !== 0 && index !== configTiers.length - 1 && (
//             <>
//               {' '}
//               -{' '}
//               <NumberFormat
//                 as="span"
//                 variant="t100"
//                 color="colorText"
//                 format="short"
//                 value={configTiers[index + 1].minimumSubscribers}
//               />
//             </>
//           )}
//         </div>
//       ),
//       icon: tiersIcons[index],
//       subscribers: tier.minimumSubscribers,
//       multiplier: tier.multiplier,
//     }))
//   : []

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
