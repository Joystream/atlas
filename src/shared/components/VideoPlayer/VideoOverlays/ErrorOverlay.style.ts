import styled from '@emotion/styled'

import { AnimatedError } from '@/shared/components/AnimatedError'
import { Button } from '@/shared/components/Button'
import { media, sizes } from '@/shared/theme'

export const AnimationWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: ${sizes(40)};
  position: relative;
  ${media.sm} {
    margin-top: ${sizes(20)};
  }
`

export const StyledAnimatedError = styled(AnimatedError)`
  width: 108px;
  position: absolute;
  bottom: 0;
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
