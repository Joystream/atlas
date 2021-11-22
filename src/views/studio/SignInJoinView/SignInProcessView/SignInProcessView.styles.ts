import styled from '@emotion/styled'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgCoinsIllustration } from '@/components/_illustrations'
import { media, oldColors, sizes } from '@/styles'

export const StyledStudioContainer = styled(LimitedWidthContainer)`
  display: flex;
  margin-top: 64px;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  ${media.md} {
    align-items: unset;
    flex-direction: row;
    justify-content: center;
  }
  ${media.xl} {
    margin-top: 40px;
    flex-direction: column;
    align-items: center;
    left: 200px;
  }
  ${media.xxl} {
    margin-top: 64px;
  }
`

export const HeroContainer = styled.div`
  max-width: 440px;
  margin-bottom: 40px;
`

export const SubTitle = styled(Text)`
  margin-top: ${sizes(4)};
`

export const ListContainer = styled.div`
  max-width: 440px;
  padding-bottom: 100px;
  ${media.md} {
    margin-left: 60px;
  }
  ${media.xl} {
    margin-left: 0;
  }
`

export const StyledCoinsIllustrations = styled(SvgCoinsIllustration)`
  z-index: -2;
  display: none;
  ${media.sm} {
    display: block;
    position: relative;
    left: -100px;
    bottom: 100px;
    width: 450px;
  }
  ${media.md} {
    position: fixed;
    left: 0;
    bottom: -200px;
  }
  ${media.lg} {
    bottom: -150px;
    width: 600px;
  }
  ${media.xl} {
    bottom: -100px;
    width: 900px;
  }
  ${media.xxl} {
    top: 150px;
    bottom: unset;
    width: 1200px;
  }
`

export const OrderedList = styled.ol`
  counter-reset: ordered-list-counter;
  list-style: none;
  position: relative;

  ::before {
    position: absolute;
    content: '';
    left: 20px;
    height: 92%;
    width: 1px;
    border: 1px dashed ${oldColors.transparentWhite[32]};
  }
`
export const OrderedItem = styled(Text)`
  counter-increment: ordered-list-counter;
  margin-left: 20px;
  position: relative;

  ::before {
    content: counter(ordered-list-counter);
    position: absolute;
    left: -64px;
    top: -6px;
    width: 48px;
    height: 48px;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${oldColors.blue[500]};
    font-weight: bold;
  }
`

export const UnOrderedList = styled.ul`
  margin-top: ${sizes(4)};
  margin-bottom: ${sizes(10)};
  padding-left: 20px;
  list-style: disc;
`

export const UnOrderedItem = styled(Text)`
  /* stylelint-disable-line */
`

export const StyledButton = styled(Button)`
  position: fixed;
  bottom: 20px;
  left: var(--size-global-horizontal-padding);
  width: calc(100% - var(--size-global-horizontal-padding) * 2);
  ${media.sm} {
    margin-top: 40px;
    position: unset;
    width: unset;
  }
`
