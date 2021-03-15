import React from 'react'
import styled from '@emotion/styled'
import { transparentize } from 'polished'
import { sizes, transitions, colors } from '@/shared/theme'
import Icon from '../Icon/Icon'
import { Tooltip } from '..'

type StateProps = {
  disabled: boolean
}
type PullUpProps = StateProps & {
  onClick: (e: React.MouseEvent<HTMLElement>) => void
}

export const PullUp: React.FC<PullUpProps> = ({ disabled, onClick, ...props }) => (
  <Tooltip above text={disabled ? 'Video already added to edit list' : 'Open in new tab'}>
    <Container disabled={disabled} onClick={onClick}>
      <BringUpIcon name="bring-up" {...props} />
    </Container>
  </Tooltip>
)

const Container = styled.div<StateProps>`
  display: flex;
  position: relative;
  width: max-content;
  padding: ${sizes(4)};
  border-radius: 100%;
  transition: all ${transitions.timings.routing} ${transitions.easing};
  path {
    ${({ disabled }) => disabled && `stroke: ${transparentize(0.4, colors.gray[100])};`}
  }
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
const BringUpIcon = styled(Icon)``
