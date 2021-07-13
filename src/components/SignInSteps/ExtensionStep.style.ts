import styled from '@emotion/styled'

import { Button, Text } from '@/shared/components'
import { sizes } from '@/shared/theme'

import { StepFooter } from './SignInSteps.style'

export const StyledButton = styled(Button)`
  margin: ${sizes(4)} 0;
`

export const StyledStepFooter = styled(StepFooter)`
  margin-top: ${sizes(12)};
`

export const StyledListItem = styled(Text)`
  text-align: left;

  & + & {
    margin-top: ${sizes(2)};
  }
`

export const PolkadotExtensionRejectedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`
