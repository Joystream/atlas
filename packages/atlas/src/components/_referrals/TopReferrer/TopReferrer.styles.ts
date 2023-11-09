import { css, keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { FlexBox } from '@/components/FlexBox'
import { GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { TierBanner } from '@/components/_referrals/TierCard/TierCard.styles'
import { cVar, media, sizes } from '@/styles'

const spin = keyframes`
  from {
    transform: translate(-50%, -50%) rotate(0);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
`

const spinAnimation = css`
  animation: ${spin} 3s linear infinite;
`
export const StyledContainer = styled(GridItem)<{ mostEarned: boolean }>`
  padding: ${sizes(4)};

  ${media.lg} {
    padding: ${sizes(6)};
  }

  grid-row: ${({ mostEarned }) => (mostEarned ? '1 / 3' : '')};
  position: relative;
  overflow: hidden;
  border-radius: calc(1.5 * ${cVar('radiusLarge')});
  display: inline-block;

  ${({ mostEarned }) =>
    mostEarned
      ? css`
          &::before {
            content: '';
            display: block;
            background: conic-gradient(#000 0turn 0.5turn, #007dff 0.6turn, #afd5fc 0.8turn, #000 1turn);
            width: calc(100% * 2.5);
            padding-bottom: calc(100% * 2.5);
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border-radius: 100%;
            z-index: -2;
            ${spinAnimation}
          }

          &--reverse::before {
            animation-direction: reverse;
          }

          &::after {
            content: '';
            position: absolute;
            inset: 2px;
            background: ${cVar('colorCoreNeutral900')};
            z-index: -1;
            border-radius: 10px;
          }
        `
      : css`
          background: ${cVar('colorCoreNeutral900')};
        `}
`

export const StyledTierBadge = styled(TierBanner)`
  padding-bottom: 0;
  border-radius: calc(1.5 * ${cVar('radiusLarge')});
`

export const StyledBadgeContentWrapper = styled(FlexBox)`
  padding: ${sizes(2)} 0;
`

export const StyledEarnedWrapper = styled(FlexBox)`
  border-radius: ${cVar('radiusSmall')};
  background: ${cVar('colorCoreNeutral900Lighten')};
  padding: ${sizes(2)};
`

export const StyledChannelInfo = styled(FlexBox)`
  padding: ${sizes(6)};
`

export const StyledHandle = styled(Text)`
  max-height: 1.3em;
  line-height: 1.3em;
`

export const StyledTiersWrapper = styled(FlexBox)`
  padding-bottom: ${sizes(4)};
`

export const StyledContentWrapper = styled(FlexBox)`
  height: 100%;
`
