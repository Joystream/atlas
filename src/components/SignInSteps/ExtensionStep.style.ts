import { Button } from '@/shared/components'
import { sizes, colors, typography } from '@/shared/theme'
import styled from '@emotion/styled'
import { StepFooter } from './SignInSteps.style'

export const StyledButton = styled(Button)`
  margin: ${sizes(4)} 0;
`

export const StyledStepFooter = styled(StepFooter)`
  margin-top: ${sizes(12)};
`

export const StyledListItem = styled.li`
  text-align: left;
  color: ${colors.gray[200]};
  font-size: ${typography.sizes.caption};
  & + & {
    margin-top: ${sizes(2)};
  }
`
