import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

type StyledTooltipProps = {
  headerText: boolean
  footer: boolean
}

export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${sizes(5)};
  height: ${sizes(5)};
  margin-right: ${sizes(1)};
`

type TooltipTextProps = {
  withIcon?: boolean
  footer: boolean
}

export const TooltipText = styled(Text)<TooltipTextProps>`
  max-width: ${({ footer }) => !footer && '200px'};
  ${({ withIcon }) => withIcon && `margin-left: ${sizes(6)}`};
`

export const TooltipHeader = styled.div`
  display: flex;
  margin-bottom: ${sizes(2)};
`

export const StyledTooltip = styled.div<StyledTooltipProps>`
  display: inline-flex;
  flex-direction: ${({ headerText, footer }) => (headerText || footer ? 'column' : 'row')};
  padding: ${sizes(3)};
  background-color: ${cVar('colorBackgroundElevated')};
  border-radius: ${cVar('radiusSmall')};
  max-width: ${({ footer }) => footer && 264}px;

  ${TooltipHeader} {
    align-items: ${({ headerText }) => (headerText ? 'center' : 'flex-start')};
  }
`
