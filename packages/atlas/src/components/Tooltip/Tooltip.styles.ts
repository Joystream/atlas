import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { SvgAlertsInformative24 } from '@/components/_icons'
import { cVar, sizes } from '@/styles'

export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${sizes(5)};
  height: ${sizes(5)};
  margin-right: ${sizes(2)};
`

export const StyledSvgAlertsInformative24 = styled(SvgAlertsInformative24)`
  path {
    fill: ${cVar('colorTextStrong')};
  }
`

type TooltipTextProps = {
  withIcon?: boolean
  footer: boolean
  oneLine?: boolean
  headerText?: boolean
}

const getOneLineStyles = ({ oneLine }: TooltipTextProps) => {
  if (oneLine) {
    return css`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `
  }
}

export const TooltipText = styled(Text)<TooltipTextProps>`
  ${getOneLineStyles};

  max-width: ${({ footer }) => !footer && '200px'};
  ${({ withIcon, headerText }) => withIcon && headerText && `margin-left: ${sizes(7)}`};
`

export const TooltipHeader = styled.div<{ headerText: boolean }>`
  display: flex;
  margin-bottom: ${({ headerText }) => headerText && sizes(2)};
`

type StyledTooltipProps = {
  headerText: boolean
  footer: boolean
  oneLine: boolean
}

export const StyledTooltip = styled.div<StyledTooltipProps>`
  display: inline-flex;
  flex-direction: ${({ headerText, footer }) => (headerText || footer ? 'column' : 'row')};
  padding: ${({ headerText, oneLine }) => sizes(!headerText && oneLine ? 2 : 3)};
  background-color: ${cVar('colorBackgroundElevated')};
  border-radius: ${cVar('radiusSmall')};
  max-width: ${({ footer }) => footer && '264px'};
  align-items: ${({ oneLine, headerText }) => (oneLine && !headerText ? 'center' : 'flex-start')};

  ${TooltipHeader} {
    align-items: ${({ headerText }) => (headerText ? 'center' : 'flex-start')};
  }
`
