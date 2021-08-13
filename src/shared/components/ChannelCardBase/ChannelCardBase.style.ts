import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { colors, media, sizes, transitions } from '@/shared/theme'

import { Avatar } from '../Avatar'
import { Button } from '../Button'
import { Text } from '../Text'

type ChannelCardWrapperProps = {
  hasRanking?: boolean
}

export const ChannelCardWrapper = styled.div<ChannelCardWrapperProps>`
  position: relative;
  display: flex;
  justify-content: ${({ hasRanking }) => (hasRanking ? 'flex-end' : 'unset')};
  width: 100%;

  ${() => ChannelCardArticle} {
    width: ${({ hasRanking }) => (hasRanking ? '78%' : '100%')};
  }
`

export const ChannelCardArticle = styled.article`
  position: relative;

  :hover:not(:active) {
    ${() => ChannelCardAnchor} {
      transform: translate(-${sizes(2)}, -${sizes(2)});
      box-shadow: ${sizes(2)} ${sizes(2)} 0 ${colors.blue['500']};
    }
  }
`

export const ChannelCardAnchor = styled(Link)`
  text-decoration: none;
  align-items: center;
  transition: transform, box-shadow;
  transition-duration: ${transitions.timings.regular};
  transition-timing-function: ${transitions.easing};
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: ${colors.gray[900]};
  padding: ${sizes(4)} 0;
`

export const StyledAvatar = styled(Avatar)`
  margin-bottom: ${sizes(4)};
`

export const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const ChannelTitle = styled(Text)`
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ChannelFollows = styled(Text)`
  margin-top: ${sizes(1)};
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const FollowButton = styled(Button)`
  margin-top: ${sizes(4)};
`

export const RankingNumber = styled.span`
  position: absolute;
  top: -8px;
  left: -48px;
  z-index: -1;
  height: 100%;
  color: black;
  font-weight: 700;
  font-size: 100px;
  -webkit-text-stroke-width: 4px;
  -webkit-text-stroke-color: ${colors.gray[500]};
  font-family: 'PxGrotesk', sans-serif;
  letter-spacing: -0.17em;
  display: flex;
  align-items: center;

  ${media.large} {
    align-items: flex-start;
    font-size: 160px;
    left: -77px;
  }

  ${media.xlarge} {
    left: -75px;
    font-size: 150px;
  }

  ${media.xxlarge} {
    left: -88px;
    font-size: 180px;
  }
`
