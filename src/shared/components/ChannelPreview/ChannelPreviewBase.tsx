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
  videoCount,
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
            {avatarURL ? <StyledAvatar imageUrl={avatarURL} handle={name} /> : <Placeholder rounded />}
          </AvatarContainer>
          <Info>
            {name ? <NameHeader variant="h6">{name}</NameHeader> : <Placeholder width="140px" height="16px" />}
            <VideoCountContainer>
              {videoCount ? (
                <VideoCount variant="subtitle2">{videoCount} Uploads</VideoCount>
              ) : (
                <Placeholder width="140px" height="16px" />
              )}
            </VideoCountContainer>
          </Info>
        </InnerContainer>
      </Anchor>
    </OuterContainer>
  )
}

export default ChannelPreviewBase
