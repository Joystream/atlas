import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { transitions } from '@/shared/theme'

import {
  Anchor,
  AvatarContainer,
  Info,
  InnerContainer,
  OuterContainer,
  StyledAvatar,
  TextBase,
  VideoCount,
  VideoCountContainer,
} from './ChannelPreviewBase.style'

import { Placeholder } from '../Placeholder'

export type ChannelPreviewBaseProps = {
  assetUrl?: string | null
  title?: string | null
  videoCount?: number
  channelHref?: string
  className?: string
  loading?: boolean
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
}

export const ChannelPreviewBase: React.FC<ChannelPreviewBaseProps> = ({
  assetUrl,
  title,
  videoCount,
  loading = true,
  channelHref,
  className,
  onClick,
}) => {
  const isAnimated = !loading && !!channelHref
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (!onClick) return
    onClick(e)
  }
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!channelHref) {
      e.preventDefault()
    }
  }
  return (
    <OuterContainer className={className} onClick={handleClick}>
      <Anchor to={channelHref ?? ''} onClick={handleAnchorClick}>
        <SwitchTransition>
          <CSSTransition
            key={loading ? 'placeholder' : 'content'}
            timeout={parseInt(transitions.timings.loading) * 0.75}
            classNames={transitions.names.fade}
          >
            <InnerContainer animated={isAnimated}>
              <AvatarContainer>
                {loading ? <Placeholder rounded /> : <StyledAvatar assetUrl={assetUrl} />}
              </AvatarContainer>
              <Info>
                {loading ? (
                  <Placeholder width="140px" height="16px" />
                ) : (
                  <TextBase variant="h6">{title || '\u00A0'}</TextBase>
                )}
                <VideoCountContainer>
                  {loading ? (
                    <Placeholder width="140px" height="16px" />
                  ) : (
                    <CSSTransition
                      in={!!videoCount}
                      timeout={parseInt(transitions.timings.loading) * 0.5}
                      classNames={transitions.names.fade}
                    >
                      <VideoCount variant="subtitle2">{videoCount ? `${videoCount} Uploads` : '⠀'}</VideoCount>
                    </CSSTransition>
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
