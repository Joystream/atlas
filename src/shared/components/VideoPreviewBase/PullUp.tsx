import React from 'react'
import styled from '@emotion/styled'
import { transparentize } from 'polished'
import { transitions, colors } from '@/shared/theme'
import { Button, Tooltip } from '..'

type StateProps = {
  disabled: boolean
}
type PullUpProps = StateProps & {
  onClick: (e: React.MouseEvent<HTMLElement>) => void
}

export const PullUp: React.FC<PullUpProps> = ({ disabled, onClick, ...props }) => (
  <Tooltip above text={disabled ? 'Video already added to edit list' : 'Open in new tab'}>
    <Container disabled={disabled} onClick={onClick}>
      <StyledButton disabled={disabled} variant="tertiary" icon="bring-up" />
    </Container>
  </Tooltip>
)

const Container = styled.div<StateProps>`
  display: flex;
  position: relative;
`
const StyledButton = styled(Button)`
  border-radius: 100%;
  transition: all ${transitions.timings.routing} ${transitions.easing};
  cursor: pointer;
  path {
    ${({ disabled }) => disabled && `stroke: ${transparentize(0.1, colors.gray[100])};`}
  }
  ${({ disabled }) => disabled && `background: none;`}
  ${({ disabled }) => disabled && `cursor: not-allowed;`}

  &:hover {
    ${({ disabled }) => !disabled && `background: ${transparentize(0.8, colors.blue[100])};`}
  }
  &:active {
    ${({ disabled }) => !disabled && `background: ${transparentize(0.8, colors.blue[300])};`}
    path {
      ${({ disabled }) => !disabled && `stroke: ${colors.gray[100]};`}
    }
  }
`
