import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { oldColors, oldTypography, sizes, transitions } from '@/styles'

export const StyledContainer = styled.div`
  background-color: ${oldColors.gray[800]};
  width: 200px;
  color: ${oldColors.white};
  word-break: break-all;
`

export const StyledMenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${sizes(4)};
  transition: background-color 200ms ${transitions.easing};

  &:hover {
    cursor: pointer;
    background-color: ${oldColors.gray[700]};
  }
`

export const StyledText = styled(Text)`
  font-size: ${oldTypography.sizes.subtitle2};
  font-weight: ${oldTypography.weights.medium};
  line-height: ${sizes(4)};
  margin-left: ${sizes(3)};
`
