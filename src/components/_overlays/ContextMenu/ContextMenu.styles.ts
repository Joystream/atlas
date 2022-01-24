import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, sizes, transitions } from '@/styles'

export const StyledContainer = styled.div`
  background-color: ${cVar('colorBackgroundStrong')};
  width: 200px;
  color: ${cVar('colorText')};
  word-break: break-all;
`

export const StyledText = styled(Text)`
  font: ${cVar('typographyDesktopH200')};
  letter-spacing: ${cVar('typographyDesktopH200LetterSpacing')};
  text-transform: ${cVar('typographyDesktopH200TextTransform')};
  margin-left: ${sizes(3)};
`
