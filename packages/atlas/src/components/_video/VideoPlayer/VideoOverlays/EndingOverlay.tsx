import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { BasicVideoFieldsFragment } from '@/api/queries'
import { Text } from '@/components/Text'
import { SvgControlsPause, SvgControlsPlay, SvgControlsReplay } from '@/components/_icons'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useAsset } from '@/providers/assets'
import { sizes } from '@/styles'

import {
  Container,
  CountDownButton,
  CountDownWrapper,
  Heading,
  InnerContainer,
  OverlayBackground,
  RestartButton,
  StyledChannelLink,
  StyledCircularProgress,
  SubHeading,
  VideoInfo,
  VideoThumbnail,
} from './EndingOverlay.styles'

type EndingOverlayProps = {
  channelId?: string
  currentThumbnailUrl?: string | null
  isFullScreen?: boolean
  onPlayAgain?: () => void
  randomNextVideo?: BasicVideoFieldsFragment | null
  isEnded: boolean
  isPlayNextDisabled?: boolean
}
// 10 seconds
const NEXT_VIDEO_TIMEOUT = 10 * 1000

export const EndingOverlay: React.FC<EndingOverlayProps> = ({
  onPlayAgain,
  isFullScreen,
  channelId,
  currentThumbnailUrl,
  randomNextVideo,
  isEnded,
  isPlayNextDisabled,
}) => {
  const navigate = useNavigate()
  const [countdownProgress, setCountdownProgress] = useState(0)
  const [isCountDownStarted, setIsCountDownStarted] = useState(false)
  const mdMatch = useMediaMatch('md')

  const { url: randomNextVideoThumbnailUrl } = useAsset(randomNextVideo?.thumbnailPhoto)

  useEffect(() => {
    if (!randomNextVideo || !isEnded) {
      return
    }
    setIsCountDownStarted(true)
  }, [isEnded, randomNextVideo])

  useEffect(() => {
    if (!randomNextVideo || !isCountDownStarted || isPlayNextDisabled) {
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
  }, [countdownProgress, isCountDownStarted, isEnded, isPlayNextDisabled, navigate, randomNextVideo])

  const disablePlayNext = useCallback(() => {
    setIsCountDownStarted(false)
    setCountdownProgress(0)
  }, [])

  useEffect(() => {
    if (isPlayNextDisabled) {
      disablePlayNext()
    }
  }, [disablePlayNext, isPlayNextDisabled])

  const handleCountDownButton = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation()
    if (isCountDownStarted) {
      disablePlayNext()
    } else {
      navigate(absoluteRoutes.viewer.video(randomNextVideo?.id))
    }
  }

  const thumbnailUrl = useMemo(() => {
    if (randomNextVideo) {
      return randomNextVideoThumbnailUrl || ''
    } else {
      return currentThumbnailUrl || ''
    }
  }, [currentThumbnailUrl, randomNextVideo, randomNextVideoThumbnailUrl])

  const stopPropagationx = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <OverlayBackground onClick={stopPropagationx}>
      {randomNextVideo ? (
        <Container isFullScreen={isFullScreen}>
          <InnerContainer
            onClick={() => {
              navigate(absoluteRoutes.viewer.video(randomNextVideo.id))
            }}
          >
            <VideoThumbnail src={thumbnailUrl} />
            <VideoInfo>
              <Text variant={mdMatch ? 't300' : 't200'} secondary>
                Up next
              </Text>
              <Heading variant={mdMatch ? 'h500' : 'h400'}>{randomNextVideo.title}</Heading>
              <StyledChannelLink
                onClick={stopPropagationx}
                id={channelId}
                avatarSize={mdMatch ? 'default' : 'bid'}
                textVariant={mdMatch ? 't300' : 't200'}
              />
            </VideoInfo>
          </InnerContainer>
          <CountDownWrapper>
            <StyledCircularProgress
              value={countdownProgress}
              maxValue={NEXT_VIDEO_TIMEOUT}
              strokeWidth={8}
              variant="player"
              noTrail={isCountDownStarted}
            />
            <CountDownButton
              icon={
                isCountDownStarted ? (
                  <SvgControlsPause width={sizes(4)} height={sizes(4)} />
                ) : (
                  <SvgControlsPlay width={sizes(4)} height={sizes(4)} />
                )
              }
              variant="tertiary"
              size="medium"
              onClick={handleCountDownButton}
            />
          </CountDownWrapper>
        </Container>
      ) : (
        <Container>
          <InnerContainer>
            <VideoInfo noNextVideo>
              <SubHeading variant={mdMatch ? 't300' : 't200'} secondary>
                You’ve finished watching a video from
              </SubHeading>
              <StyledChannelLink
                id={channelId}
                avatarSize={mdMatch ? 'small' : 'bid'}
                noNextVideo
                textVariant={mdMatch ? 'h700' : 'h400'}
              />
              <RestartButton onClick={onPlayAgain} variant="secondary" icon={<SvgControlsReplay />}>
                Play again
              </RestartButton>
            </VideoInfo>
          </InnerContainer>
        </Container>
      )}
    </OverlayBackground>
  )
}
