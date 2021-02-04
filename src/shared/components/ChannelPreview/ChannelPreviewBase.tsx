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
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { transitions } from '@/shared/theme'

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
  loading = true,
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
        <SwitchTransition>
          <CSSTransition
            key={loading ? 'placeholder' : 'content'}
            timeout={parseInt(transitions.timings.loading) * 0.75}
            classNames={transitions.names.fade}
          >
            <InnerContainer animated={loading === false && animated}>
              <AvatarContainer>
                {loading ? <Placeholder rounded /> : <StyledAvatar imageUrl={avatarURL} handle={name} />}
              </AvatarContainer>

              <Info>
                {loading ? <Placeholder width="140px" height="16px" /> : <NameHeader variant="h6">{name}</NameHeader>}
                <VideoCountContainer>
                  {loading ? (
                    <Placeholder width="140px" height="16px" />
                  ) : (
                    <VideoCount variant="subtitle2">{videoCount ? `${videoCount} Uploads` : '⠀'}</VideoCount>
                  )}
                </VideoCountContainer>
              </Info>
            </InnerContainer>
          </CSSTransition>
        </SwitchTransition>
      </Anchor>
    </OuterContainer>
  )
}

export default ChannelPreviewBase
