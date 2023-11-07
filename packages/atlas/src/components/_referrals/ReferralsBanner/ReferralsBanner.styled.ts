import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import { Banner } from '@/components/Banner'
import { media, sizes } from '@/styles'
import { StyledScrollingListImage } from '@/views/global/ReferralsView/sections/ReferralsList/ReferralsList.styles'

export const StyledBanner = styled(Banner)`
  width: 100vw;
  left: calc(-1 * var(--size-global-horizontal-padding));
  border-left: none;
  background-size: contain;
  position: relative;
  overflow: hidden;
  padding: ${sizes(4)} var(--size-global-horizontal-padding);

  ${media.md} {
    width: calc(100vw - var(--size-sidenav-width-collapsed));
    left: calc(
      -1 * max(((100vw - var(--max-inner-width)) / 2) - var(--size-sidenav-width-collapsed), 0px) - var(--size-global-horizontal-padding)
    );
  }
`

const rotatedScroll = keyframes`
  0% {
      transform: translate(-50%, -24%) rotate(45deg);
  }
  100% {
      transform: translate(190%, -76.4%) rotate(45deg);
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
  height: auto;
  animation: ${rotatedScrollXxs} 20s linear infinite;
  opacity: 0.4;
  z-index: -1;
  left: calc(50% - 376px);

  ${media.sm} {
    animation: ${rotatedScroll} 20s linear infinite;
    opacity: 0.8;
  }
`
