import styled from '@emotion/styled'

import { colors, typography } from '@/shared/theme'

import { Text } from '../Text'

export type HelperTextProps = {
  helperTextVariant?: 'default' | 'error' | 'warning'
}

const helperVariants = {
  default: colors.gray[400],
  error: colors.error,
  warning: colors.warning,
}

export const StyledHelperText = styled(Text)<HelperTextProps>`
  margin: 0;
  color: ${({ helperTextVariant = 'default' }) => helperVariants[helperTextVariant]};
  word-break: break-all;
`

export const HelperTextsWrapper = styled.div`
  margin-left: 4px;
  margin-top: 8px;
  font-size: ${typography.sizes.body2};
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const HelperTextCount = styled(Text)<HelperTextProps>`
  color: ${({ helperTextVariant = 'default' }) => helperVariants[helperTextVariant]};
`
