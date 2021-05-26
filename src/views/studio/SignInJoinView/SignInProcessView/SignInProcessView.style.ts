import styled from '@emotion/styled'
import { ReactComponent as CoinsIllustration } from '@/assets/coins.svg'
import { colors, media, sizes } from '@/shared/theme'
import { StudioContainer } from '@/components'
import { Button, Text } from '@/shared/components'

export const StyledStudioContainer = styled(StudioContainer)`
  display: flex;
  margin-top: 50px;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  ${media.medium} {
    align-items: unset;
    flex-direction: row;
    justify-content: center;
  }
  ${media.xlarge} {
    margin-top: 100px;
    flex-direction: column;
    align-items: center;
    left: 200px;
  }
  ${media.xxlarge} {
    margin-top: 250px;
  }
`

export const HeroContainer = styled.div`
  max-width: 400px;
  margin-bottom: 60px;
`

export const SubTitle = styled(Text)`
  margin-top: ${sizes(4)};
`

export const ListContainer = styled.div`
  max-width: 440px;
  padding-bottom: 150px;
  ${media.medium} {
    margin-left: 60px;
  }
  ${media.xlarge} {
    margin-left: 0;
  }
`

export const StyledCoinsIllustrations = styled(CoinsIllustration)`
  z-index: -2;
  display: none;
  ${media.small} {
    position: relative;
    left: -100px;
    bottom: 150px;
    width: 450px;
    display: block;
  }
  ${media.medium} {
    position: fixed;
    bottom: -200px;
    left: 0;
  }
  ${media.large} {
    bottom: -150px;
    width: 600px;
    margin-top: unset;
  }
  ${media.xlarge} {
    bottom: -100px;
    width: 900px;
    margin-top: unset;
  }
  ${media.xxlarge} {
    bottom: unset;
    top: 150px;
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
    border: 1px dashed ${colors.transparentWhite[32]};
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
    background-color: ${colors.blue[500]};
    font-weight: bold;
  }
`

export const UnOrderedList = styled.ul`
  margin-top: ${sizes(4)};
  margin-bottom: ${sizes(10)};
  padding-left: 20px;
  list-style: disc;
`

export const UnOrderedItem = styled(Text)``

export const StyledButton = styled(Button)`
  margin-top: 40px;
  position: fixed;
  bottom: 20px;
  left: var(--global-horizontal-padding);
  width: calc(100% - var(--global-horizontal-padding) * 2);
  ${media.small} {
    position: unset;
    width: unset;
  }
`
