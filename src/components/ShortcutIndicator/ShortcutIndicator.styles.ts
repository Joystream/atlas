import styled from '@emotion/styled'

import { colors, sizes, square, typography } from '@/theme'

export const ShortcutIndicator = styled.kbd`
  ${square(16)};

  font-family: ${typography.fonts.base};
  color: ${colors.gray[300]};
  font-weight: ${typography.weights.extraBold};
  font-size: 11px;
  border: 1px solid ${colors.gray[500]};
  border-radius: 2px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 12px;
  margin-left: ${sizes(2)};
`
