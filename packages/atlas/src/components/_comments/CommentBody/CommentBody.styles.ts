import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { sizes } from '@/styles'

export const StyledCommentText = styled(Text)<{ commentExpanded?: boolean }>`
  white-space: pre-line;
  overflow: hidden;
  word-break: break-word;
  text-overflow: ellipsis;
  /* stylelint-disable-next-line value-no-vendor-prefix */
  display: -webkit-box;
  -webkit-line-clamp: ${({ commentExpanded }) => (commentExpanded ? 'unset' : 3)};
  line-clamp: ${({ commentExpanded }) => (commentExpanded ? 'unset' : 3)};
  -webkit-box-orient: vertical;
`

export const ExpandButton = styled(TextButton)`
  margin-top: ${sizes(2)};
`
