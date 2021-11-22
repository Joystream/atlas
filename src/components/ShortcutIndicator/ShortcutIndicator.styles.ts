import styled from '@emotion/styled'

import { oldColors, oldTypography, sizes, square } from '@/styles'

export const ShortcutIndicator = styled.kbd`
  ${square(16)};

  font-family: ${oldTypography.fonts.base};
  color: ${oldColors.gray[300]};
  font-weight: ${oldTypography.weights.extraBold};
  font-size: 11px;
  border: 1px solid ${oldColors.gray[500]};
  border-radius: 2px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  line-height: 12px;
  margin-left: ${sizes(2)};
`
