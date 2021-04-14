import React from 'react'
import styled from '@emotion/styled'
import { transitions, colors } from '@/shared/theme'
import { IconButton, Tooltip } from '..'
import { css } from '@emotion/react'

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

const disabledStyle = css`
  background: none;
  cursor: not-allowed;
  path {
    stroke: ${colors.transparentWhite[32]};
  }
  &:hover {
    background: none;
  }
`

const enabledStyle = css`
  &:hover {
    background: ${colors.transparentPrimary[12]};
  }
  &:active {
    background: ${colors.transparentPrimary[6]};
    stroke: ${colors.gray[100]};
  }
`

const StyledButton = styled(IconButton)`
  transition: all ${transitions.timings.routing} ${transitions.easing};
  cursor: pointer;
  ${({ disabled }) => [disabled && disabledStyle, !disabled && enabledStyle]}
`
