import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { SvgActionArrowRight } from '@/components/_icons'
import { cVar, media, sizes } from '@/styles'

export const TermsBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background-color: ${cVar('colorBackgroundStrong')};
  box-shadow: ${cVar('effectDividersTop')};
  padding: ${sizes(4)};

  ${media.md} {
    position: absolute;
    bottom: 80px;
    left: ${sizes(1)};
  }
`

export const StyledSvgActionArrowRight = styled(SvgActionArrowRight)`
  margin-right: ${sizes(8)};
`

export const Row = styled.div`
  margin-top: ${sizes(4)};

  ${media.md} {
    display: flex;
    justify-content: space-between;
  }
`

export const Title = styled.div`
  display: flex;
  align-items: center;
`

export const AuctionDurationTooltipFooter = styled.div`
  padding: ${sizes(2)};
  margin-top: 10px;
  background-color: ${cVar('colorBackgroundElevated')};
`

export const Description = styled.div`
  display: flex;
`

export const Header = styled(Text)`
  margin-bottom: ${sizes(8)};
`

export const Divider = styled.hr`
  height: 1px;
  border: 0;
  box-shadow: ${cVar('effectDividersTop')};
  margin: ${sizes(10)} 0;
`
