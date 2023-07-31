import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Avatar } from '@/components/Avatar'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { cVar, sizes, square } from '@/styles'

export { ChannelCardArticle } from './ChannelCard.styles'

export const ChannelCardAnchor = styled(Link)`
  width: 100%;
  padding: ${sizes(6)};
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  transition: ${cVar('animationTransitionFast')} box;
  transition-property: transform, box-shadow;
  background-color: ${cVar('colorBackgroundMuted')};
`

export const StyledAvatar = styled(Avatar)`
  margin-bottom: ${sizes(4)};
  ${square(sizes(10))}
`

export const InfoWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;

  .denomination {
    font-size: 16px;
  }
`

export const Amount = styled(NumberFormat)`
  font-size: 32px;
  line-height: ${sizes(10)};
  height: ${sizes(10)};

  ::before {
    content: '+ ';
    color: ${cVar('colorTextMuted')};
  }
`

export const ChannelTitle = styled(Text)`
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: ${sizes(2)};

  ::before {
    content: 'for ';
    color: ${cVar('colorTextMuted')};
  }
`
