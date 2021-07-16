import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { CSSTransition } from 'react-transition-group'

import { useVideos } from '@/api/hooks'
import { AssetAvailability, VideoFieldsFragment } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { AssetType, useAsset } from '@/providers'
import { SvgGlyphRestart, SvgPlayerPause, SvgPlayerPlay } from '@/shared/icons'
import { colors, transitions } from '@/shared/theme'
import { getRandomIntInclusive } from '@/utils/number'

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

export type PlayerState = 'loading' | 'ended' | 'error' | 'not-initialized' | null

type EndingOverlayProps = {
  channelId?: string
  isFullScreen?: boolean
  currentThumbnail?: string | null
  onPlayAgain?: () => void
  isEnded: boolean
}

export const EndingOverlay: React.FC<EndingOverlayProps> = ({
  onPlayAgain,
  channelId,
  isEnded,
  isFullScreen,
  currentThumbnail,
}) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [countdownProgress, setCountdownProgress] = useState(0)
  const [isCountDownStarted, setIsCountDownStarted] = useState(false)
  const [randomNextVideo, setRandomNextVideo] = useState<VideoFieldsFragment | null>(null)
  const { videos } = useVideos({
    where: {
      channelId_eq: channelId,
      isPublic_eq: true,
      mediaAvailability_eq: AssetAvailability.Accepted,
    },
  })

  const getRandomNumber = useCallback((videosLength: number) => {
    return getRandomIntInclusive(0, videosLength - 1)
  }, [])

  useEffect(() => {
    if (!videos?.length || videos.length <= 1) {
      return
    }
    const filteredVideos = videos.filter((video) => video.id !== id)
    const randomNumber = getRandomNumber(filteredVideos.length)

    setRandomNextVideo(filteredVideos[randomNumber])
  }, [id, getRandomNumber, videos])

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
    }, 50)

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
  }, [countdownProgress, isCountDownStarted, navigate, isEnded, randomNextVideo])

  const handleCountDownmButton = () => {
    if (isCountDownStarted) {
      setIsCountDownStarted(false)
      setCountdownProgress(0)
    } else {
      navigate(absoluteRoutes.viewer.video(randomNextVideo?.id))
    }
  }
  if (!isEnded) {
    return null
  }
  return (
    <CSSTransition in={isEnded} classNames={transitions.names.fade} timeout={200}>
      <OverlayBackground thumbnail={randomNextVideo ? randomNextVideoThumbnail : currentThumbnail}>
        {randomNextVideo ? (
          <InnerContainer isFullScreen={isFullScreen}>
            <VideoInfo>
              <SubHeading variant="body1" secondary style={{ flexShrink: 0 }}>
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
    </CSSTransition>
  )
}
