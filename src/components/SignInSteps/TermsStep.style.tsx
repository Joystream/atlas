import React from 'react'
import { Button, IconButton, Text } from '@/shared/components'
import { colors, sizes } from '@/shared/theme'
import styled from '@emotion/styled'

export const TermsBox = styled.div`
  scroll-behavior: smooth;
  text-align: left;
  margin-bottom: ${sizes(10)};
  position: relative;
  height: 300px;
  width: 100%;
  background-color: ${colors.gray[800]};
  overflow: auto;
`
export const TextWrapper = styled.div`
  margin: ${sizes(9)} ${sizes(17)} ${sizes(9)} ${sizes(8)};
  a {
    text-decoration: none;
    color: ${colors.gray[50]};
  }
`
const _TermsParagraph = styled(Text)`
  margin-top: ${sizes(6)};
  ol + & {
    margin-top: 0;
  }
`

export const TermsParagraph: React.FC<{ header?: boolean }> = ({ header, ...props }) => (
  <_TermsParagraph variant={header ? 'h6' : 'body2'} secondary={!header} {...props} />
)
// wrapper so we can use a specific element to render
const _StyledText = styled(Text)``
export const TermsListItem: React.FC = (props) => <_StyledText variant="body2" secondary as="li" {...props} />

export const LastUpdateText = styled(TermsParagraph)`
  font-style: italic;
`

export const TermsOverlay = styled.div`
  position: sticky;
  left: 0;
  bottom: 0;
  height: 35%;
  width: auto;
  background: linear-gradient(180deg, transparent 0%, ${colors.gray[800]} 100%);
`
export const ScrollButton = styled(IconButton)`
  position: absolute;
  right: ${sizes(6)};
  bottom: ${sizes(6)};
`

export const ContinueButton = styled(Button)`
  margin-left: auto;
`
