import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { colors, sizes, transitions } from '@/shared/theme'

import { ActionBarSize } from '.'
import { Button } from '../Button'
import { Text } from '../Text'

type ActionBarContainerProps = {
  size: ActionBarSize
}

const getActionBarStyle = ({ size }: ActionBarContainerProps) => {
  switch (size) {
    case 'compact':
      return css`
        display: grid;
        padding: ${sizes(4)};
        grid-template-rows: auto auto;
        grid-template-columns: 1fr;
      `
    case 'medium':
    case 'large':
      return css`
        display: flex;
        justify-content: space-between;
        padding: ${sizes(4)} ${sizes(8)};
      `
    default:
      return null
  }
}

type FlexWrapperProps = {
  compact?: boolean
}

export const FlexWrapper = styled.div<FlexWrapperProps>`
  display: flex;
  height: ${({ compact }) => (compact ? '40px' : '48px')};
  justify-content: space-between;
`

export const ActionBarContainer = styled.div<ActionBarContainerProps>`
  background-color: ${colors.gray[900]};
  border-top: 1px solid ${colors.gray[700]};
  ${getActionBarStyle}
`

export const StyledPrimaryText = styled(Text)`
  margin-right: ${sizes(5)};
  align-self: center;
`

type ActionButtonPrimaryProps = {
  actonBarSize: ActionBarSize
}

export const ActionButtonPrimary = styled(Button)<ActionButtonPrimaryProps>`
  margin-left: ${({ actonBarSize }) => (actonBarSize === 'compact' ? 0 : sizes(4))};
  margin-top: ${({ actonBarSize }) => (actonBarSize === 'compact' ? sizes(4) : 0)};
`

export const StyledSecondaryText = styled(Text)`
  max-width: 360px;
  align-self: center;
`

type DetailsContainerProps = {
  size: ActionBarSize
}

export const DetailsContainer = styled.div<DetailsContainerProps>`
  user-select: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  height: 100%;
  padding: ${({ size }) => (size === 'compact' ? `${sizes(4)} 0` : `0 ${sizes(4)}`)};
  transition: background-color ${transitions.timings.sharp} ${transitions.easing};

  :hover {
    ${({ size }) => size !== 'compact' && `background-color: ${colors.transparentPrimary[18]}`};
  }
`

export const DetailsIconWrapper = styled.span`
  margin-left: ${sizes(2)};
`
