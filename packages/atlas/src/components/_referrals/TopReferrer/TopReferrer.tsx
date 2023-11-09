import { Avatar } from '@/components/Avatar'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { Tier, getTierIcon } from '@/components/_referrals/TierCard'
import {
  StyledBadgeContentWrapper,
  StyledChannelInfo,
  StyledContainer,
  StyledContentWrapper,
  StyledEarnedWrapper,
  StyledTierBadge,
  StyledTiersWrapper,
} from '@/components/_referrals/TopReferrer/TopReferrer.styles'
import { pluralizeNoun } from '@/utils/misc'

type TopReferrerProps = {
  mostEarned: boolean
  handle: string | null | undefined
  avatarUrls?: string[]
  totalReferredChannels?: number
  referredByTier?: { [key in Tier]: number }
  totalEarnings: number
}
export const TopReferrer = ({
  handle,
  avatarUrls,
  totalEarnings,
  referredByTier,
  totalReferredChannels,
  mostEarned,
}: TopReferrerProps) => {
  return (
    <StyledContainer
      colStart={{ lg: mostEarned ? 2 : undefined }}
      colSpan={{ base: 12, sm: 4, lg: mostEarned ? 4 : 3 }}
      mostEarned={mostEarned}
    >
      <StyledContentWrapper justifyContent="space-between" flow="column">
        <FlexBox flow="column">
          <StyledChannelInfo flow="column" gap={2} alignItems="center">
            <Avatar assetUrls={avatarUrls} size={mostEarned ? 104 : 56} />
            <Text as="div" variant={mostEarned ? 'h500' : 't300'} color={mostEarned ? 'colorTextStrong' : 'colorText'}>
              {handle}
            </Text>
          </StyledChannelInfo>
          {mostEarned && (
            <StyledTiersWrapper flow="column" gap={2} alignItems="center">
              <FlexBox flow="row" justifyContent="space-between">
                <Text as="div" variant="t300">
                  Referred
                </Text>
                <Text as="div" variant="t300">
                  {pluralizeNoun(totalReferredChannels || 0, 'Channel')}{' '}
                </Text>
              </FlexBox>
              {mostEarned && referredByTier && (
                <FlexBox flow="row" gap={2} justifyContent="center">
                  {Object.entries(referredByTier).map(([tier, count]) => (
                    <StyledTierBadge key={tier} tier={tier.toLowerCase() as Tier}>
                      <StyledBadgeContentWrapper flow="column" gap={1.5} alignItems="center">
                        {getTierIcon(tier.toLowerCase() as Tier)}
                        <Text variant="t100-strong" as="p">
                          {count}
                        </Text>
                      </StyledBadgeContentWrapper>
                      <div className="absolute-container">
                        <svg>
                          <filter id="noise">
                            <feTurbulence type="fractalNoise" baseFrequency="1" numOctaves="1" stitchTiles="stitch" />
                            <feBlend in="SourceGraphic" in2="colorNoise" mode="multiply" />
                          </filter>
                        </svg>
                      </div>
                    </StyledTierBadge>
                  ))}
                </FlexBox>
              )}
            </StyledTiersWrapper>
          )}
        </FlexBox>

        <StyledEarnedWrapper justifyContent="space-between">
          <Text as="div" variant="t300">
            Earned
          </Text>
          <Text as="div" variant="t300">
            +{totalEarnings} USD
          </Text>
        </StyledEarnedWrapper>
      </StyledContentWrapper>
    </StyledContainer>
  )
}
