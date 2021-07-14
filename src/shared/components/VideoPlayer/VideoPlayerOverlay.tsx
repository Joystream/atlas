import React, { useEffect, useState } from 'react'
import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router'
import { CSSTransition } from 'react-transition-group'

import { useVideos } from '@/api/hooks'
import { AssetAvailability, VideoFieldsFragment } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { AssetType, useAsset } from '@/providers'
import { SvgPlayerPause, SvgPlayerPlay, SvgPlayerRestart } from '@/shared/icons'
import { colors, transitions } from '@/shared/theme'
import { getRandomIntInclusive } from '@/utils/number'

import {
  CountDownButton,
  CountDownWrapper,
  Heading,
  OverlayBackground,
  PlayOverlay,
  RestartButton,
  StyledChannelLink,
  StyledCircularProgressBar,
} from './VideoPlayerOverlay.style'

import { Text } from '../Text'

export type PlayerState = 'loading' | 'ended' | 'error' | null

type VideoPlayerOverlayProps = {
  playerState: PlayerState
  channelId?: string
  onPlayAgain?: () => void
}

const VideoPlayerOverlay: React.FC<VideoPlayerOverlayProps> = ({ playerState, onPlayAgain, channelId }) => {
  const { id } = useParams()
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

  const [countdownProgress, setCountdownProgress] = useState(0)
  const [isCountDownStarted, setIsCountDownStarted] = useState(false)
  const navigate = useNavigate()

  const { url: thumbnail } = useAsset({
    entity: randomNextVideo,
    assetType: AssetType.THUMBNAIL,
  })

  useEffect(() => {
    if (!randomNextVideo || playerState !== 'ended') {
      return
    }
    setIsCountDownStarted(true)
  }, [playerState, randomNextVideo])

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

    if (playerState !== 'ended') {
      clearTimeout(timeout)
      setCountdownProgress(0)
      setIsCountDownStarted(false)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [countdownProgress, isCountDownStarted, navigate, playerState, randomNextVideo])

  const handleCountDownmButton = () => {
    if (isCountDownStarted) {
      setIsCountDownStarted(false)
      setCountdownProgress(0)
    } else {
      navigate(absoluteRoutes.viewer.video(randomNextVideo?.id))
    }
  }

  return (
    <CSSTransition in={!!playerState} classNames={transitions.names.fade} timeout={200}>
      <div>
        {playerState === 'ended' && randomNextVideo && (
          <PlayOverlay>
            <Text variant="body1" secondary>
              Up next
            </Text>
            <Heading variant="h3">{randomNextVideo.title}</Heading>
            <StyledChannelLink id={randomNextVideo.channel.id} avatarSize={'default'} />
            <CountDownWrapper>
              <StyledCircularProgressBar
                value={countdownProgress}
                strokeWidth={8}
                trailColor={isCountDownStarted ? 'transparent' : colors.transparentWhite[32]}
              />
              <CountDownButton onClick={handleCountDownmButton}>
                {isCountDownStarted ? <SvgPlayerPause /> : <SvgPlayerPlay />}
              </CountDownButton>
            </CountDownWrapper>
          </PlayOverlay>
        )}
        {playerState === 'ended' && !randomNextVideo && (
          <PlayOverlay>
            <Text variant="body1" secondary>
              You’ve finished watching a video from
            </Text>
            <StyledChannelLink id={channelId} avatarSize="small" noNextVideo />
            <RestartButton onClick={onPlayAgain} variant="secondary" icon={<SvgPlayerRestart />}>
              Play again
            </RestartButton>
          </PlayOverlay>
        )}
        {playerState && <OverlayBackground playerState={playerState} thumbnail={thumbnail} />}
      </div>
    </CSSTransition>
  )
}

export default VideoPlayerOverlay
