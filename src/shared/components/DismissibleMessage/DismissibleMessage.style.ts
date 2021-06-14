import styled from '@emotion/styled'

import { IconButton } from '@/shared/components'
import { SvgGlyphInfo } from '@/shared/icons'
import { colors, sizes } from '@/shared/theme'

import { Text } from '../Text'

export const MessageWrapper = styled.div`
  position: relative;
  padding: ${sizes(4)};
  border: 1px solid ${colors.gray[700]};
  width: 100%;
  max-width: 450px;
`

export const MessageButton = styled(IconButton)`
  position: absolute;
  top: ${sizes(2)};
  right: ${sizes(2)};
`

export const StyledSvgGlyphInfo = styled(SvgGlyphInfo)`
  margin-right: ${sizes(2)};
`

export const MessageTitle = styled(Text)`
  display: flex;
  align-items: center;
  word-break: break-word;
`

export const MessageDescription = styled(Text)`
  margin-top: ${sizes(2)};
  line-height: ${sizes(5)};
  color: ${colors.gray[300]};
  word-break: break-word;
`
