import styled from '@emotion/styled'
import { fluidRange } from 'polished'

import { breakpoints, colors, media, sizes, zIndex } from '@/shared/theme'

import { AnimatedError } from '../../AnimatedError'
import { Button } from '../../Button'
import { Text } from '../../Text'

export const OverlayBackground = styled.div`
  display: flex;
  z-index: ${zIndex.nearOverlay};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${colors.gray[900]};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
`

export const InnerContainer = styled.div`
  padding: ${sizes(4)};
  height: 100%;
  overflow-y: auto;
  flex-direction: column;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  ${media.small} {
    padding: ${sizes(6)};
  }
`

export const AnimationWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: ${sizes(40)};
  position: relative;
  ${media.small} {
    margin-top: ${sizes(20)};
  }
`

export const StyledAnimatedError = styled(AnimatedError)`
  width: 108px;
  position: absolute;
  bottom: 0;
  ${media.small} {
    width: 216px;
  }
`

export const Heading = styled(Text)`
  ${fluidRange({ prop: 'fontSize', fromSize: '20px', toSize: '40px' }, breakpoints.base, breakpoints.medium)};

  margin-top: ${sizes(8)};
  text-align: center;
`

export const ErrorMessage = styled(Text)`
  ${fluidRange({ prop: 'fontSize', fromSize: '14px', toSize: '16px' }, breakpoints.base, breakpoints.medium)};

  max-width: 560px;
  margin-top: ${sizes(2)};
  text-align: center;
`

export const ButtonGroup = styled.div`
  margin-top: ${sizes(8)};
  display: flex;
`
export const StyledDiscordButton = styled(Button)`
  margin-right: ${sizes(4)};
`
