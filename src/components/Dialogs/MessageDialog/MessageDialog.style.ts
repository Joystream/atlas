import styled from '@emotion/styled'
import { colors, sizes } from '@/shared/theme'
import { Text } from '@/shared/components'

// TODO: change to wrapper
export const MessageIcon = styled.div`
  margin-bottom: ${sizes(4)};
`

export const StyledTitleText = styled(Text)`
  width: 90%;
  margin-bottom: ${sizes(3)};
  word-wrap: break-word;
`

export const StyledDescriptionText = styled(Text)`
  color: ${colors.gray[300]};
  word-wrap: break-word;
`
