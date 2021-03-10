import { Button, Text } from '@/shared/components'
import { colors, sizes, zIndex } from '@/shared/theme'
import styled from '@emotion/styled'
import { ReactComponent as BackgroundPatternSVG } from '@/assets/bg-pattern.svg'

export const StyledBackgroundPattern = styled(BackgroundPatternSVG)`
  position: absolute;
  left: 50%;
  top: 73px;
  z-index: ${zIndex.background};
  transform: translateX(-50%);
`

export const SignInWrapper = styled.div`
  margin-top: ${sizes(20)};
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 200px;
`

export const Header = styled.header``

export const ButtonGroup = styled.div`
  margin-top: ${sizes(12)};
`
export const SignInButton = styled(Button)`
  margin-right: ${sizes(3)};
  cursor: pointer;
`
export const HowItWorksButton = styled(Button)`
  cursor: pointer;
`

export const SubTitle = styled(Text)`
  margin-top: ${sizes(4)};
  color: ${colors.gray[400]};
`

export const VideoImage = styled.div`
  background-color: ${colors.gray[800]};
  border-radius: ${sizes(1)};
  box-shadow: 0px 8px 16px 0px #000000 12%, 0px 4px 4px 0px #000000 10%; ;
`

export const Tile = styled.div``
