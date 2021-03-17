import { Button, Text } from '@/shared/components'
import { breakpoints, colors, sizes, zIndex } from '@/shared/theme'
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
  top: 0;
  left: 0;
  z-index: ${zIndex.background};
  max-width: 100%;
  transform: translateX(0);
  @media screen and (min-width: ${breakpoints.small}) {
    left: 50%;
    transform: translateX(-50%);
  }
`

export const SignInWrapper = styled.div`
  width: 100%;
  overflow-x: hidden;
`
export const Header = styled.header`
  margin-top: ${sizes(20)};
  max-width: 710px;
`

export const ButtonGroup = styled.div`
  margin-top: ${sizes(12)};
`
export const SignInButton = styled(Button)`
  margin-right: ${sizes(3)};
`

export const SubTitle = styled(Text)`
  margin-top: ${sizes(4)};
  color: ${colors.gray[400]};
`

export const CompositionWrapper = styled.div`
  position: absolute;
  z-index: ${zIndex.background};
  right: ${sizes(8)};
  top: 0;
`

export const VideoImageWrapper = styled.div`
  margin-top: ${sizes(10)};
  img {
    max-width: 320px;
    @media screen and (min-width: ${breakpoints.small}) {
      max-width: 100%;
    }
  }
`

export const Tile = styled.img`
  position: absolute;
  top: 60%;
  left: 0;
  max-width: 250px;
  @media screen and (min-width: ${breakpoints.small}) {
    max-width: 100%;
    left: 50%;
    transform: translateX(-50%);
  }
`

export const Overlay = styled.div`
  z-index: ${zIndex.background};
  position: absolute;
  top: 0;
  left: calc(0px - var(--global-horizontal-padding));
  background: radial-gradient(100% 200% at 0% 100%, black 0%, rgba(0, 0, 0, 0.4) 100%);
  width: 100%;
  height: 150%;
  overflow: hidden;
  @media screen and (min-width: ${breakpoints.small}) {
    left: 0;
    width: 100%;
  }
  @media screen and (min-width: ${breakpoints.medium}) {
    background: radial-gradient(100% 200% at 0% 100%, black 0%, rgba(0, 0, 0, 0) 100%);
    width: 70%;
    left: 20%;
  }
`
