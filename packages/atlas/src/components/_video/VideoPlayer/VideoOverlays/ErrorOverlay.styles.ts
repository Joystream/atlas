import styled from '@emotion/styled'

import { AnimatedError } from '@/components/AnimatedError'
import { Button } from '@/components/_buttons/Button'
import { media, sizes } from '@/styles'

export const AnimationWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: -30px;
  ${media.sm} {
    margin-top: -50px;
  }
`

export const StyledAnimatedError = styled(AnimatedError)`
  width: 108px;
  ${media.sm} {
    width: 216px;
  }
`

export const ButtonGroup = styled.div`
  margin-top: ${sizes(8)};
  justify-content: center;
  display: flex;
`
export const StyledDiscordButton = styled(Button)`
  margin-right: ${sizes(4)};
`
