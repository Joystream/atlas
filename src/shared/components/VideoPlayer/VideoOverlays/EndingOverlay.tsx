import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { VideoBasicFieldsFragment } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { AssetType, useAsset } from '@/providers'
import { SvgGlyphRestart, SvgPlayerPause, SvgPlayerPlay } from '@/shared/icons'

import {
  CountDownButton,
  CountDownWrapper,
  Heading,
  InnerContainer,
  OverlayBackground,
  RestartButton,
  StyledChannelLink,
  StyledCircularProgressBar,
  SubHeading,
  VideoInfo,
} from './EndingOverlay.style'

type EndingOverlayProps = {
  channelId?: string
  currentThumbnailUrl?: string | null
  isFullScreen?: boolean
  onPlayAgain?: () => void
  randomNextVideo?: VideoBasicFieldsFragment | null
  isEnded: boolean
}
// 10 seconds
const NEXT_VIDEO_TIMEOUT = 10000

export const EndingOverlay: React.FC<EndingOverlayProps> = ({
  onPlayAgain,
  isFullScreen,
  channelId,
  currentThumbnailUrl,
  randomNextVideo,
  isEnded,
}) => {
  const navigate = useNavigate()
  const [countdownProgress, setCountdownProgress] = useState(0)
  const [isCountDownStarted, setIsCountDownStarted] = useState(false)

  const { url: randomNextVideoThumbnailUrl } = useAsset({
    entity: randomNextVideo,
    assetType: AssetType.THUMBNAIL,
  })

  useEffect(() => {
    if (!randomNextVideo || !isEnded) {
      return
    }
    setIsCountDownStarted(true)
  }, [isEnded, randomNextVideo])

  useEffect(() => {
    if (!randomNextVideo || !isCountDownStarted) {
      return
    }

    const tick = NEXT_VIDEO_TIMEOUT / 100
    const timeout = setTimeout(() => {
      setCountdownProgress(countdownProgress + tick)
    }, tick)

    if (countdownProgress === NEXT_VIDEO_TIMEOUT) {
      navigate(absoluteRoutes.viewer.video(randomNextVideo.id))
    }

    if (!isEnded) {
      clearTimeout(timeout)
      setCountdownProgress(0)
      setIsCountDownStarted(false)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [countdownProgress, isCountDownStarted, isEnded, navigate, randomNextVideo])

  const handleCountDownButton = () => {
    if (isCountDownStarted) {
      setIsCountDownStarted(false)
      setCountdownProgress(0)
    } else {
      navigate(absoluteRoutes.viewer.video(randomNextVideo?.id))
    }
  }

  return (
    <OverlayBackground thumbnailUrl={randomNextVideo ? randomNextVideoThumbnailUrl : currentThumbnailUrl}>
      {randomNextVideo ? (
        <InnerContainer isFullScreen={isFullScreen}>
          <VideoInfo>
            <SubHeading variant="body1" secondary>
              Up next
            </SubHeading>
            <Heading variant="h3">{randomNextVideo.title}</Heading>
            <StyledChannelLink id={channelId} avatarSize="default" />
          </VideoInfo>
          <CountDownWrapper>
            <StyledCircularProgressBar
              value={countdownProgress}
              maxValue={NEXT_VIDEO_TIMEOUT}
              strokeWidth={8}
              variant={'player'}
              noTrail={!isCountDownStarted}
            />
            <CountDownButton variant="tertiary" onClick={handleCountDownButton}>
              {isCountDownStarted ? <SvgPlayerPause /> : <SvgPlayerPlay />}
            </CountDownButton>
          </CountDownWrapper>
        </InnerContainer>
      ) : (
        <InnerContainer isFullScreen={isFullScreen}>
          <VideoInfo>
            <SubHeading variant="body1" secondary>
              You’ve finished watching a video from
            </SubHeading>
            <StyledChannelLink id={channelId} avatarSize="small" noNextVideo />
            <RestartButton onClick={onPlayAgain} variant="secondary" icon={<SvgGlyphRestart />}>
              Play again
            </RestartButton>
          </VideoInfo>
        </InnerContainer>
      )}
    </OverlayBackground>
  )
}
