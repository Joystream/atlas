import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { colors, sizes, transitions, typography } from '@/theme'

export const StyledContainer = styled.div`
  background-color: ${colors.gray[800]};
  width: 200px;
  color: ${colors.white};
  word-break: break-all;
`

export const StyledMenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${sizes(4)};
  transition: background-color 200ms ${transitions.easing};

  &:hover {
    cursor: pointer;
    background-color: ${colors.gray[700]};
  }
`

export const StyledText = styled(Text)`
  font-size: ${typography.sizes.subtitle2};
  font-weight: ${typography.weights.medium};
  line-height: ${sizes(4)};
  margin-left: ${sizes(3)};
`
