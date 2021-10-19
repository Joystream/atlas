import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { BasicVideoFieldsFragment } from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { AssetType, useAsset } from '@/providers/assets'
import { Text } from '@/shared/components/Text'
import { SvgGlyphRestart, SvgPlayerPause, SvgPlayerPlay } from '@/shared/icons'

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
} from './EndingOverlay.style'

type EndingOverlayProps = {
  channelId?: string
  currentThumbnailUrl?: string | null
  isFullScreen?: boolean
  onPlayAgain?: () => void
  randomNextVideo?: BasicVideoFieldsFragment | null
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
  const mdMatch = useMediaMatch('md')

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

  const handleCountDownButton = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation()
    if (isCountDownStarted) {
      setIsCountDownStarted(false)
      setCountdownProgress(0)
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

  return (
    <OverlayBackground>
      {randomNextVideo ? (
        <Container isFullScreen={isFullScreen}>
          <InnerContainer>
            <VideoThumbnail src={thumbnailUrl} />
            <VideoInfo>
              <Text variant={mdMatch ? 'body1' : 'body2'} secondary>
                Up next
              </Text>
              <Heading variant={mdMatch ? 'h4' : 'h5'}>{randomNextVideo.title}</Heading>
              <StyledChannelLink id={channelId} avatarSize="default" textVariant={mdMatch ? 'body1' : 'body2'} />
            </VideoInfo>
          </InnerContainer>
          <CountDownWrapper>
            <StyledCircularProgress
              value={countdownProgress}
              maxValue={NEXT_VIDEO_TIMEOUT}
              strokeWidth={8}
              variant={'player'}
              noTrail={isCountDownStarted}
            />
            <CountDownButton variant="tertiary" onClick={handleCountDownButton}>
              {isCountDownStarted ? <SvgPlayerPause /> : <SvgPlayerPlay />}
            </CountDownButton>
          </CountDownWrapper>
        </Container>
      ) : (
        <Container>
          <InnerContainer>
            <VideoInfo noNextVideo>
              <SubHeading variant={mdMatch ? 'body1' : 'body2'} secondary>
                You’ve finished watching a video from
              </SubHeading>
              <StyledChannelLink id={channelId} avatarSize="small" noNextVideo textVariant={mdMatch ? 'h2' : 'h5'} />
              <RestartButton onClick={onPlayAgain} variant="secondary" icon={<SvgGlyphRestart />}>
                Play again
              </RestartButton>
            </VideoInfo>
          </InnerContainer>
        </Container>
      )}
    </OverlayBackground>
  )
}
