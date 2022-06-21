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
  headerText?: boolean
}

export const TooltipText = styled(Text)<TooltipTextProps>`
  display: inline-block;
  max-width: 200px;

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
  display: inline-flex;
  flex-direction: ${({ hasHeader, hasCustomContent }) => (hasHeader || hasCustomContent ? 'column' : 'row')};
  padding: ${({ hasHeader, multiline }) => sizes(hasHeader || multiline ? 3 : 2)};
  background-color: ${cVar('colorBackgroundElevated')};
  border-radius: ${cVar('radiusSmall')};
  align-items: ${({ multiline, hasHeader }) => (!multiline && !hasHeader ? 'center' : 'flex-start')};
  ${({ hasCustomContent }) => hasCustomContent && customContentCss};

  ${TooltipHeader} {
    align-items: ${({ hasHeader }) => (hasHeader ? 'center' : 'flex-start')};
  }
`

export const TooltipContent = styled.div<{ headerText: boolean }>`
  display: ${({ headerText }) => (headerText ? 'block' : 'flex')};
  align-items: center;
  align-self: baseline;
`
