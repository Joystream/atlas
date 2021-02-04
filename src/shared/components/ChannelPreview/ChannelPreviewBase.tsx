import React from 'react'
import {
  Anchor,
  AvatarContainer,
  Info,
  InnerContainer,
  NameHeader,
  OuterContainer,
  StyledAvatar,
  VideoCount,
  VideoCountContainer,
} from './ChannelPreviewBase.style'
import Placeholder from '../Placeholder'

type ChannelPreviewBaseProps = {
  avatarURL?: string
  name?: string
  videoCount?: number
  channelHref?: string
  className?: string
  animated?: boolean
  loading?: boolean
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}

const ChannelPreviewBase: React.FC<ChannelPreviewBaseProps> = ({
  avatarURL,
  name,
  videoCount = 0,
  loading,
  channelHref,
  className,
  animated = false,
  onClick,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!onClick) return
    onClick(e)
  }

  return (
    <OuterContainer className={className} onClick={handleClick}>
      <Anchor href={channelHref}>
        <InnerContainer animated={animated}>
          <AvatarContainer>
            {loading ? <Placeholder rounded /> : <StyledAvatar imageUrl={avatarURL} handle={name} />}
          </AvatarContainer>
          <Info>
            {loading ? <Placeholder width="140px" height="16px" /> : <NameHeader variant="h6">{name}</NameHeader>}
            <VideoCountContainer>
              {loading ? (
                <Placeholder width="140px" height="16px" />
              ) : (
                <VideoCount variant="subtitle2">{videoCount} Uploads</VideoCount>
              )}
            </VideoCountContainer>
          </Info>
        </InnerContainer>
      </Anchor>
    </OuterContainer>
  )
}

export default ChannelPreviewBase
