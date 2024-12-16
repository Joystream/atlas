import { CommentTipTier } from '@/api/queries/__generated__/baseTypes.generated'
import {
  SvgSupportBadgeDiamond10,
  SvgSupportBadgeDiamond14,
  SvgSupportBadgeDiamondMuted14,
  SvgSupportBadgeGold10,
  SvgSupportBadgeGold14,
  SvgSupportBadgeGoldMuted14,
  SvgSupportBadgeSilver10,
  SvgSupportBadgeSilver14,
  SvgSupportBadgeSilverMuted14,
} from '@/assets/icons'
import { Text } from '@/components/Text'
import { formatNumber } from '@/utils/number'

import { BadgeFrame } from './Comment.styles'

export const getTierIcon = (tier: CommentTipTier, varaint: 'default' | 'muted' | 'small' = 'default') => {
  if (tier === CommentTipTier.Silver) {
    switch (varaint) {
      case 'default':
        return <SvgSupportBadgeSilver14 />
      case 'small':
        return <SvgSupportBadgeSilver10 />
      case 'muted':
        return <SvgSupportBadgeSilverMuted14 />
    }
  } else if (tier === CommentTipTier.Gold) {
    switch (varaint) {
      case 'default':
        return <SvgSupportBadgeGold14 />
      case 'small':
        return <SvgSupportBadgeGold10 />
      case 'muted':
        return <SvgSupportBadgeGoldMuted14 />
    }
  } else if (tier === CommentTipTier.Diamond) {
    switch (varaint) {
      case 'default':
        return <SvgSupportBadgeDiamond14 />
      case 'small':
        return <SvgSupportBadgeDiamond10 />
      case 'muted':
        return <SvgSupportBadgeDiamondMuted14 />
    }
  }
  return null
}

export type CommentTierBadgeProps = {
  tier: CommentTipTier
  amount: number
}

export const CommentTierBadge = ({ tier, amount }: CommentTierBadgeProps) => {
  return (
    <BadgeFrame tier={tier}>
      {getTierIcon(tier, 'small')}
      <Text as="span" variant="t100" color="colorText">
        {formatNumber(Math.floor(amount))} JOY
      </Text>
    </BadgeFrame>
  )
}
