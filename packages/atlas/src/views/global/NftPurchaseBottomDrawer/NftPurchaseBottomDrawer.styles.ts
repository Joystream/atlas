import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { NumberFormat } from '@/components/NumberFormat'
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
export const Content = styled.div`
  display: flex;
  flex-direction: column-reverse;
  overflow-y: auto;
  padding-bottom: 130px;

  ${media.md} {
    height: 100%;
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
  padding: ${sizes(8)} ${sizes(4)} 0 ${sizes(4)};

  ${media.md} {
    padding-top: ${sizes(16)};
  }

  ${media.lg} {
    flex: 50%;
    padding: ${sizes(16)} 0 0 0;
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
  padding: ${sizes(8)} ${sizes(4)} 0 ${sizes(4)};

  ${media.md} {
    padding: ${sizes(16)} ${sizes(4)} ${sizes(18)} ${sizes(4)};
    max-width: 550px;
  }
  ${media.lg} {
    padding-top: ${sizes(16)} 0 0 0;
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

export const TokenWrapper = styled.div`
  position: relative;
  left: -4px;
  z-index: ${zIndex.overlay};
  margin-right: ${sizes(2)};

  /* token background */

  &::before {
    content: '';
    position: absolute;
    width: 28px;
    height: 28px;
    background-color: ${cVar('colorBackgroundStrong')};
    border-radius: 100%;
    left: -2px;
    top: -2px;
  }
`

export const StyledJoyTokenIcon = styled(JoyTokenIcon)`
  position: relative;
`

export const BidAmount = styled(NumberFormat)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ActionBarCell = styled.div`
  width: 50%;
  padding: ${sizes(4)};
`

export const ActiveBidWrapper = styled.div`
  display: flex;
`

export const MinimumBidWrapper = styled.div`
  margin-bottom: ${sizes(4)};
  flex-direction: column;

  ${media.md} {
    ${flexStyles};

    justify-content: space-between;
    flex-direction: row;
  }
`

export const BuyNowInfo = styled(Text)`
  ${media.md} {
    max-width: 527px;
  }
`

export const MinimumBid = styled.div`
  ${flexStyles};

  margin-bottom: ${sizes(2)};

  svg {
    margin-left: ${sizes(2)};
    margin-right: ${sizes(1)};
  }

  ${media.md} {
    margin-bottom: unset;
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

  svg {
    flex-shrink: 0;
  }
`
