import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { cVar, media, sizes } from '@/styles'

const flexStyles = css`
  display: flex;
  align-items: center;
`

export const FlexWrapper = styled.div`
  ${flexStyles};
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

  ${media.md} {
    height: 100%;
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
    padding: 0;
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

export const BuyNowInfo = styled(Text)`
  ${media.md} {
    max-width: 527px;
  }
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
