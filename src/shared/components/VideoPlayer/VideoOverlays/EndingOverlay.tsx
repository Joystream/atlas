import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { VideoFieldsFragment } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { AssetType, useAsset } from '@/providers'
import { SvgGlyphRestart, SvgPlayerPause, SvgPlayerPlay } from '@/shared/icons'
import { colors } from '@/shared/theme'

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
  currentThumbnail?: string | null
  isFullScreen?: boolean
  onPlayAgain?: () => void
  randomNextVideo?: VideoFieldsFragment | null
  isEnded: boolean
}

export const EndingOverlay: React.FC<EndingOverlayProps> = ({
  onPlayAgain,
  isFullScreen,
  channelId,
  currentThumbnail,
  randomNextVideo,
  isEnded,
}) => {
  const navigate = useNavigate()
  const [countdownProgress, setCountdownProgress] = useState(0)
  const [isCountDownStarted, setIsCountDownStarted] = useState(false)

  const { url: randomNextVideoThumbnail } = useAsset({
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
    const timeout = setTimeout(() => {
      setCountdownProgress(countdownProgress + 1)
    }, 100)

    if (countdownProgress === 100) {
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

  const handleCountDownmButton = () => {
    if (isCountDownStarted) {
      setIsCountDownStarted(false)
      setCountdownProgress(0)
    } else {
      navigate(absoluteRoutes.viewer.video(randomNextVideo?.id))
    }
  }

  return (
    <OverlayBackground thumbnail={randomNextVideo ? randomNextVideoThumbnail : currentThumbnail}>
      {randomNextVideo ? (
        <InnerContainer isFullScreen={isFullScreen}>
          <VideoInfo>
            <SubHeading variant="body1" secondary>
              Up next
            </SubHeading>
            <Heading variant="h3">{randomNextVideo.title}</Heading>
            <StyledChannelLink id={randomNextVideo.channel.id} avatarSize="default" />
          </VideoInfo>
          <CountDownWrapper>
            <StyledCircularProgressBar
              value={countdownProgress}
              strokeWidth={8}
              trailColor={isCountDownStarted ? 'transparent' : colors.transparentWhite[32]}
            />
            <CountDownButton variant="tertiary" onClick={handleCountDownmButton}>
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
