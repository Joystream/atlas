import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { colors, sizes, typography } from '@/theme'

export type HelperTextProps = {
  helperTextVariant?: 'error' | 'warning'
}

const helperVariants = {
  error: colors.secondary.alert[100],
  warning: colors.secondary.warning[100],
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
  font-size: ${typography.sizes.body2};
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const HelperTextCount = styled(Text)<HelperTextProps>`
  ${({ helperTextVariant }) => helperTextVariant && `color: ${helperVariants[helperTextVariant]}`};
`
