import styled from '@emotion/styled'

import { colors, sizes, square, typography } from '@/shared/theme'

export const ShortcutIndicator = styled.kbd`
  ${square(16)};

  font-family: ${typography.fonts.base};
  color: ${colors.gray[300]};
  font-weight: ${typography.weights.extraBold};
  font-size: 0.7rem;
  border: 1px solid ${colors.gray[500]};
  border-radius: 2px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 11px;
  margin-left: ${sizes(2)};
`
