import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { ChannelCardVariant } from '@/components/ChannelCard'
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

type ChannelCardArticleProps = {
  variant?: ChannelCardVariant
}
export const ChannelCardArticle = styled.article<ChannelCardArticleProps>`
  position: relative;

  :hover:not(:active) {
    ${() => ChannelCardAnchor} {
      transform: ${({ variant }) => (variant === 'primary' ? `translate(-${sizes(2)}, -${sizes(2)}) ` : 'unset')};
      box-shadow: ${({ variant }) =>
        variant === 'primary' ? `${sizes(2)} ${sizes(2)} 0 ${colors.blue['500']}` : 'unset'};
    }
  }
`
type ChannelCardAnchorProps = {
  variant?: ChannelCardVariant
}

export const ChannelCardAnchor = styled(Link)<ChannelCardAnchorProps>`
  text-decoration: none;
  align-items: center;
  transition: transform, box-shadow;
  transition-duration: ${transitions.timings.regular};
  transition-timing-function: ${transitions.easing};
  display: ${({ variant }) => (variant === 'primary' ? 'flex' : 'inline-flex')};
  justify-content: ${({ variant }) => (variant === 'primary' ? 'center' : 'unset')};
  flex-direction: ${({ variant }) => (variant === 'primary' ? 'column' : 'row')};
  background-color: ${({ variant }) => (variant === 'primary' ? colors.gray[900] : 'none')};
  padding: ${({ variant }) => (variant === 'primary' ? `${sizes(4)} 0` : 'unset')};
`

type StyledAvatarProps = {
  variant?: ChannelCardVariant
}

export const StyledAvatar = styled(Avatar)<StyledAvatarProps>`
  margin-bottom: ${({ variant }) => (variant === 'primary' ? sizes(4) : 'unset')};
  margin-right: ${({ variant }) => (variant === 'secondary' ? sizes(6) : 'unset')};
`

type InfoWrapperProps = {
  variant?: ChannelCardVariant
}

export const InfoWrapper = styled.div<InfoWrapperProps>`
  display: flex;
  flex-direction: column;
  align-items: ${({ variant }) => (variant === 'primary' ? 'center' : 'unset')};
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

type FollowButtonProps = {
  channelVariant?: ChannelCardVariant
}

export const FollowButton = styled(Button)<FollowButtonProps>`
  margin-top: ${({ channelVariant }) => (channelVariant === 'primary' ? sizes(4) : sizes(2))};
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
