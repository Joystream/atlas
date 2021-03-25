import React from 'react'
import { Text } from '@/shared/components'
import { colors, sizes } from '@/shared/theme'
import styled from '@emotion/styled'
import { css } from '@emotion/react'

export const Box = styled.div`
  scroll-behavior: smooth;
  text-align: left;
  margin-bottom: ${sizes(10)};
  position: relative;
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
const _Paragraph = styled(Text)`
  /* remove in sumer */
  color: ${colors.gray[300]};

  margin-top: ${sizes(6)};
  ol + & {
    margin-top: 0;
  }
`

export const Paragraph: React.FC<{ header?: boolean }> = ({ header, ...props }) => (
  <_Paragraph
    variant={header ? 'h6' : 'body2'}
    // secondary={!header}
    {...props}
  />
)
// wrapper so we can use a specific element to render
const _StyledText = styled(Text)`
  /* remove in sumer */
  color: ${colors.gray[300]};
`
export const ListItem: React.FC = (props) => (
  // remove li in sumer
  <li
    css={css`
      /* remove in sumer */
      color: ${colors.gray[300]};
    `}
  >
    <_StyledText
      variant="body2"
      // secondary
      // as="li"
      {...props}
    />
  </li>
)

export const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  margin-top: ${sizes(10)};
  max-width: 800px;
  text-align: center;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
`
