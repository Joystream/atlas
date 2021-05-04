import styled from '@emotion/styled'
import { ReactComponent as CoinsIllustration } from '@/assets/coins.svg'
import { colors, media, sizes } from '@/shared/theme'
import { StudioContainer } from '@/components'
import { Button, Text } from '@/shared/components'

export const StyledStudioContainer = styled(StudioContainer)`
  display: flex;
  flex-wrap: wrap;
  margin-top: 64px;
  justify-content: space-between;
`

export const HeroContainer = styled.div`
  max-width: 400px;
  margin-bottom: 60px;
`

export const ListContainer = styled.div`
  max-width: 440px;
`

export const StyledCoinsIllustrations = styled(CoinsIllustration)`
  z-index: -2;
  bottom: 0;
  left: 0;
  width: 250px;
  position: fixed;
  margin-top: 50px;
  ${media.small} {
    width: 300px;
  }
  ${media.medium} {
    width: 350px;
  }
  ${media.large} {
    width: 650px;
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
  margin-top: 64px;
`
