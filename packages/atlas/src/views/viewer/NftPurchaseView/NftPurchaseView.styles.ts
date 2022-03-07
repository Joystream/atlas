import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { ActionBar } from '@/components/ActionBar'
import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { cVar, media, sizes, zIndex } from '@/styles'

const flexStyles = css`
  display: flex;
  align-items: center;
`

export const FlexWrapper = styled.div`
  ${flexStyles};
`

export const Container = styled.div`
  transform: translateY(100%);
  opacity: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${cVar('colorBackground')};
  box-shadow: ${cVar('effectElevation24Layer1')}, ${cVar('effectElevation24Layer2')};
  transition: transform ${cVar('animationTransitionSlow')}, opacity ${cVar('animationTransitionSlow')};
  will-change: transform, opacity;
  z-index: ${zIndex.globalOverlay};

  &.place-bid {
    &-exit,
    &-enter-active,
    &-enter-done {
      opacity: 1;
      transform: translateY(0);
    }

    &-enter,
    &-exit-active {
      transform: translateY(100%);
      opacity: 0;
    }
  }
`

export const Content = styled.div`
  padding-top: ${sizes(8)};
  display: flex;
  flex-direction: column-reverse;
  height: 100%;
  overflow-y: auto;
  padding-bottom: 130px;

  ${media.md} {
    padding-top: ${sizes(16)};
    flex-direction: row;
    overflow-y: unset;
    padding-bottom: unset;

    > * {
      flex: 50%;
    }
  }
`

export const NftPreview = styled.div`
  display: flex;
  justify-content: center;
  flex: 1 0 auto;
  align-items: baseline;
  padding: 0 ${sizes(4)};

  ${media.lg} {
    flex: 50%;
    padding: 0;
  }
`

export const PlaceBidWrapper = styled.div`
  padding-bottom: ${sizes(6)};

  ${media.sm} {
    height: calc(100% - 80px);
    overflow-y: auto;
    padding-bottom: unset;
  }
`

export const InnerContainer = styled.div`
  padding: 0 ${sizes(4)};

  ${media.md} {
    max-width: 550px;
    padding-bottom: ${sizes(18)};
  }
  ${media.lg} {
    max-width: 560px;
  }
`

export const Header = styled.div`
  margin-bottom: ${sizes(6)};

  > ${FlexWrapper} {
    margin-top: ${sizes(4)};

    ${media.sm} {
      margin-top: 0;
      margin-left: auto;
    }
  }

  ${media.sm} {
    display: flex;
    align-items: center;
  }
`

export const EndingTime = styled.div`
  ${flexStyles};

  position: relative;

  ::after {
    content: '';
    display: block;
    position: absolute;
    right: 0;
    width: 1px;
    height: 32px;
    background-color: ${cVar('colorBorderMutedAlpha')};
  }
`

export const Timer = styled(Text)`
  min-width: 77px;
`

export const CurrentBidWrapper = styled.div`
  margin-bottom: ${sizes(6)};
  background-color: ${cVar('colorBackgroundStrong')};
`

export const BidderName = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ActionBarCell = styled.div`
  width: 50%;
  padding: ${sizes(3.5)} ${sizes(4)};

  :nth-of-type(2) {
    border-left: 1px solid ${cVar('colorBorderMutedAlpha')};
  }
`

export const ActiveBidWrapper = styled.div`
  display: flex;
`

export const CurrentBidAvatar = styled(Avatar)`
  margin-right: ${sizes(2)};
`

export const CurrentBidJoyToken = styled(JoyTokenIcon)`
  margin-right: ${sizes(1)};
`

export const MinimumBidWrapper = styled.div`
  ${flexStyles};

  justify-content: space-between;
  margin-bottom: ${sizes(4)};
`

export const MinimumBid = styled.div`
  ${flexStyles};

  svg {
    margin-left: ${sizes(2)};
    margin-right: ${sizes(1)};
  }
`

export const Divider = styled.hr`
  height: 1px;
  border: 0;
  box-shadow: ${cVar('effectDividersTop')};
  margin-top: ${sizes(6)};
  margin-bottom: ${sizes(4)};
`

export const StyledActionBar = styled(ActionBar)`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
`
export const PaymentSplitWrapper = styled.div`
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: repeat(2, 1fr) auto;
  margin-top: ${sizes(4)};
  gap: ${sizes(4)};
`

export const PaymentSplitValues = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${sizes(2)};
`

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${sizes(2)};
`

export const Messages = styled.div`
  ${flexStyles};

  margin-top: ${sizes(8)};
`
