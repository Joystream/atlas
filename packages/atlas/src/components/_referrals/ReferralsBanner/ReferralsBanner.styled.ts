import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { Banner } from '@/components/Banner'
import { media } from '@/styles'
import { StyledScrollingListImage } from '@/views/global/ReferralsView/sections/ReferralsList/ReferralsList.styles'

export const StyledBanner = styled(Banner)`
  width: calc(100% + var(--size-global-horizontal-padding) * 2);
  margin-left: calc(-1 * var(--size-global-horizontal-padding));
  border-left: none;
  background-size: contain;
  position: relative;
  overflow: hidden;
`

const rotatedScroll = keyframes`
  0% {
      transform: translate(0, -24%) rotate(45deg);
  }
  100% {
      transform: translate(240%, -76.4%) rotate(45deg);
  }
`
const rotatedScrollXxs = keyframes`
  0% {
      transform: translate(-70%, -24%) rotate(45deg);
  }
  100% {
      transform: translate(170%, -76.4%) rotate(45deg);
  }
`

export const StyledScrollingList = styled(StyledScrollingListImage)`
  width: 376px;
  animation: ${rotatedScrollXxs} 20s linear infinite;
  opacity: 0.4;
  z-index: -1;

  ${media.sm} {
    animation: ${rotatedScroll} 20s linear infinite;
    opacity: 0.8;
  }
`
