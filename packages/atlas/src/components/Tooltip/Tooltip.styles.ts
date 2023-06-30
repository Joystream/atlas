import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { SvgAlertsInformative24 } from '@/assets/icons'
import { Text } from '@/components/Text'
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
  headerText?: boolean
}

export const TooltipText = styled(Text)<TooltipTextProps>`
  display: inline-block;
  max-width: 224px;

  ${({ withIcon, headerText }) => withIcon && headerText && `margin-left: ${sizes(7)}`};
`

export const TooltipHeader = styled.div<{ headerText: boolean }>`
  display: flex;
  margin-bottom: ${({ headerText }) => headerText && sizes(2)};
`

type TooltipContainerProps = {
  hasHeader: boolean
  hasCustomContent: boolean
  multiline: boolean
}

const customContentCss = css`
  max-width: 264px;
`

export const TooltipContainer = styled.div<TooltipContainerProps>`
  display: block;
  flex-direction: ${({ hasHeader, hasCustomContent }) => (hasHeader || hasCustomContent ? 'column' : 'row')};
  padding: ${({ hasHeader, multiline }) => sizes(hasHeader || multiline ? 3 : 2)};
  background-color: ${cVar('colorBackgroundElevated')};
  border-radius: ${cVar('radiusSmall')};
  align-items: ${({ multiline, hasHeader }) => (!multiline && !hasHeader ? 'center' : 'flex-start')};
  ${({ hasCustomContent }) => hasCustomContent && customContentCss};

  ${TooltipHeader} {
    align-items: ${({ hasHeader }) => (hasHeader ? 'center' : 'flex-start')};
  }

  box-shadow: ${cVar('effectElevation8Layer2')}, ${cVar('effectElevation8Layer1')};
`

export const TooltipContent = styled.div<{ headerText: boolean }>`
  display: ${({ headerText }) => (headerText ? 'block' : 'flex')};
  align-items: center;
  align-self: baseline;
`
