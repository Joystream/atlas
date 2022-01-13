import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, oldColors, sizes, transitions } from '@/styles'

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
  font: ${cVar('typographyDesktopH200')};
  letter-spacing: ${cVar('typographyDesktopH200LetterSpacing')};
  text-transform: ${cVar('typographyDesktopH200TextTransform')};
  margin-left: ${sizes(3)};
`
