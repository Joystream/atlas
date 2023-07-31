import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Avatar } from '@/components/Avatar'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { cVar, sizes, square } from '@/styles'

export const ChannelCardArticle = styled.article<{ activeDisabled?: boolean }>`
  position: relative;
  display: flex;
  min-width: 260px;

  :hover {
    ${() => ChannelCardAnchor} {
      transform: translate(-${sizes(2)}, -${sizes(2)});
      box-shadow: ${sizes(2)} ${sizes(2)} 0 ${cVar('colorCoreBlue500')};
    }
  }

  :active {
    ${() => ChannelCardAnchor} {
      ${({ activeDisabled }) =>
        !activeDisabled &&
        css`
          transform: translate(0, 0);
          box-shadow: ${sizes(0)} ${sizes(0)} 0 ${cVar('colorCoreBlue500')};
        `}
    }
  }
`

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
`

export const Amount = styled(NumberFormat)`
  font-size: 32px;
  line-height: ${sizes(10)};
  margin-bottom: ${sizes(1)};

  &::before {
    content: '+ ';
    color: ${cVar('colorTextMuted')};
  }
`

export const ChannelTitle = styled(Text)`
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: ${sizes(4)};

  &::before {
    content: 'for ';
    color: ${cVar('colorTextMuted')};
  }
`
