import styled from '@emotion/styled'

import { LayoutGrid } from '@/components/LayoutGrid/LayoutGrid'
import { Text } from '@/components/Text'
import { ChannelCard } from '@/components/_channel/ChannelCard'
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

export const DetailsText = styled(Text)`
  margin-bottom: ${sizes(4)};
`

export const StyledLayoutGrid = styled(LayoutGrid)`
  margin-bottom: 50px;
`

export const ChannelsOwnedContainerGrid = styled(LayoutGrid)`
  margin-top: ${sizes(4)};

  ${media.md} {
    margin-top: ${sizes(6)};
  }
`

export const StyledChannelCard = styled(ChannelCard)`
  min-width: 136px;
`

export const Anchor = styled(Text)<React.HTMLProps<HTMLAnchorElement>>`
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`
