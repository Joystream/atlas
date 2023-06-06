import styled from '@emotion/styled'
import { HTMLProps } from 'react'

import { LayoutGrid } from '@/components/LayoutGrid/LayoutGrid'
import { Text } from '@/components/Text'
import { cVar, media, sizes } from '@/styles'

export const TextContainer = styled.div<{ withDivider?: boolean }>`
  display: grid;
  grid-gap: ${sizes(4)};
  padding-bottom: ${sizes(8)};
  margin-bottom: ${sizes(8)};
  box-shadow: ${({ withDivider }) => (withDivider ? cVar('effectDividersBottom') : 'unset')};
`

export const Details = styled.div`
  display: grid;
  gap: ${sizes(2)};
  padding-bottom: ${sizes(4)};
  box-shadow: ${cVar('effectDividersBottom')};
  margin-bottom: ${sizes(4)};
`

export const StyledLayoutGrid = styled(LayoutGrid)`
  margin-bottom: 50px;
`

export const ChannelsOwnedContainerGrid = styled.div`
  margin-top: ${sizes(4)};
  display: grid;
  grid-template-columns: 1fr;
  gap: ${sizes(4)};

  ${media.sm} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${media.md} {
    grid-template-columns: repeat(3, 1fr);
    gap: ${sizes(6)};
    margin-top: ${sizes(6)};
  }
  ${media.lg} {
    grid-template-columns: repeat(4, 1fr);
  }
`

export const Anchor = styled(Text)<HTMLProps<HTMLAnchorElement>>`
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`
