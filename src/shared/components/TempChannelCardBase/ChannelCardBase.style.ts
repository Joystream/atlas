import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { colors, media, sizes, transitions } from '@/shared/theme'

import { Avatar } from '../Avatar'
import { SkeletonLoader } from '../SkeletonLoader'
import { Text } from '../Text'

type ChannelCardWrapperProps = {
  hasRanking?: boolean
}

export const ChannelCardWrapper = styled.div<ChannelCardWrapperProps>`
  position: relative;
  display: flex;
  ${({ hasRanking }) => `
    justify-content: ${hasRanking ? 'flex-end' : 'center'};
  `}

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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${colors.gray[900]};
  padding: ${sizes(4)} 0;
  max-width: 256px;
  height: 244px;
  transition: transform, box-shadow;
  transition-duration: ${transitions.timings.regular};
  transition-timing-function: ${transitions.easing};
`

export const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: ${sizes(4)};
`

export const StyledAvatar = styled(Avatar)`
  width: 104px;
  height: 104px;
`

export const ChannelTitle = styled(Text)`
  margin-top: ${sizes(4)};
  max-width: 200px;
  width: 100%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const ChannelFollows = styled(Text)`
  margin-top: ${sizes(1)};
  max-width: 200px;
  width: 100%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

export const TitleSkeletonLoader = styled(SkeletonLoader)`
  margin-top: ${sizes(4)};
`

export const FollowsSkeletonLoader = styled(SkeletonLoader)`
  margin-top: ${sizes(1)};
`

export const ButtonSkeletonLoader = styled(SkeletonLoader)`
  margin-top: ${sizes(1)};
`
