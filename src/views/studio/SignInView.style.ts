import { Button, Text } from '@/shared/components'
import { colors, sizes, zIndex } from '@/shared/theme'
import styled from '@emotion/styled'
import { ReactComponent as BackgroundPatternSVG } from '@/assets/bg-pattern.svg'

type StepWrapperProps = {
  centered?: boolean
}

export const StepWrapper = styled.div<StepWrapperProps>`
  width: 100%;
  text-align: ${({ centered }) => (centered ? 'center' : 'left')};
  display: flex;
  flex-direction: column;
  align-items: ${({ centered }) => (centered ? 'center' : 'flex-start')};
  margin-top: ${({ centered }) => (centered ? sizes(12) : sizes(2))};
  min-height: 400px;
`

export const StepTitle = styled(Text)`
  line-height: ${sizes(8)};
  margin-top: ${sizes(4)};
  max-width: 400px;
`

export const StepSubTitle = styled(Text)`
  margin-top: ${sizes(2)};
  color: ${colors.gray[200]};
  max-width: 400px;
`
export const StepButton = styled(Button)`
  margin-top: ${sizes(8)};
  margin-bottom: ${sizes(20)};
`

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
  overflow-x: hidden;
`
export const Header = styled.header`
  max-width: 710px;
`

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

export const CompositionWrapper = styled.div`
  position: absolute;
  max-width: 50%;
  left: 50%;
  top: 73px;
  z-index: ${zIndex.background};
`
export const VideoImageWrapper = styled.div`
  margin-top: ${sizes(10)};
  background-color: ${colors.gray[800]};
  border-radius: ${sizes(1)};
`

export const Tile = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
`

export const Overlay = styled.div`
  z-index: ${zIndex.background};
  position: absolute;
  top: 73px;
  left: 30%;
  background: radial-gradient(101.07% 169.48% at 0% 100%, black 0%, rgba(0, 0, 0, 0) 100%);
  width: 50%;
  height: 100%;
  overflow: hidden;
`
