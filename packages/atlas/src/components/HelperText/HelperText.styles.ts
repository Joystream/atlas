import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

export type HelperTextProps = {
  helperTextVariant?: 'error' | 'warning'
}

const helperVariants = {
  error: cVar('colorCoreRed400'),
  warning: cVar('colorCoreYellow200'),
}

export const StyledHelperText = styled(Text)<HelperTextProps>`
  margin: 0;
  word-break: break-all;
  ${({ helperTextVariant }) => helperTextVariant && `color: ${helperVariants[helperTextVariant]}`};
`

export const HelperTextsWrapper = styled.div`
  min-height: ${sizes(3.5)};
  margin-left: 4px;
  margin-top: 8px;
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
