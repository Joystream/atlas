import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { SvgActionWarning } from '@/components/_icons'
import { cVar, oldColors, sizes } from '@/styles'

export type HelperTextProps = {
  helperTextVariant?: 'error' | 'warning'
}

const helperVariants = {
  error: oldColors.secondary.alert[100],
  warning: oldColors.secondary.warning[100],
}

export const StyledHelperText = styled(Text)<HelperTextProps>`
  margin: 0;
  word-break: break-all;
  ${({ helperTextVariant }) => helperTextVariant && `color: ${helperVariants[helperTextVariant]}`};
`

export const HelperTextsWrapper = styled.div`
  min-height: ${sizes(3.5)};
  margin-top: ${sizes(4)};
  font: ${cVar('typographyDesktopT200')};
  letter-spacing: ${cVar('typographyDesktopT200LetterSpacing')};
  text-transform: ${cVar('typographyDesktopT200TextTransform')};
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const HelperTextCount = styled(Text)<HelperTextProps>`
  ${({ helperTextVariant }) => helperTextVariant && `color: ${helperVariants[helperTextVariant]}`};
`

export const StyledSvgActionWarning = styled(SvgActionWarning)`
  margin-right: ${sizes(2)};

  path {
    fill: ${cVar('colorTextError')};
  }
`

export const TextWrapper = styled.div`
  display: flex;
  align-items: center;
`
