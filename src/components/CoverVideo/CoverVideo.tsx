import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import { useCoverVideo } from '@/api/hooks'
import { absoluteRoutes } from '@/config/routes'
import { useAsset } from '@/hooks'
import { Placeholder, VideoPlayer } from '@/shared/components'
import { SvgPlayerPause, SvgPlayerPlay, SvgPlayerSoundOff, SvgPlayerSoundOn } from '@/shared/icons'
import { transitions } from '@/shared/theme'

import {
  ButtonsContainer,
  Container,
  ControlsContainer,
  HorizontalGradientOverlay,
  InfoContainer,
  Media,
  MediaWrapper,
  PlayButton,
  PlayerContainer,
  PlayerPlaceholder,
  SoundButton,
  StyledChannelLink,
  Title,
  TitleContainer,
  TitlePlaceholder,
  VerticalGradientOverlay,
} from './CoverVideo.style'

const VIDEO_PLAYBACK_DELAY = 1250

export const CoverVideo: React.FC = () => {
  const { data } = useCoverVideo()

  const [videoPlaying, setVideoPlaying] = useState(false)
  const [displayControls, setDisplayControls] = useState(false)
  const [soundMuted, setSoundMuted] = useState(true)
  const { getAssetUrl } = useAsset()

  const handlePlaybackDataLoaded = () => {
    setTimeout(() => {
      setDisplayControls(true)
      setVideoPlaying(true)
    }, VIDEO_PLAYBACK_DELAY)
  }

  const handlePlayPauseClick = () => {
    setVideoPlaying(!videoPlaying)
  }

  const handleSoundToggleClick = () => {
    setSoundMuted(!soundMuted)
  }

  const handlePlay = () => {
    setVideoPlaying(true)
  }

  const handlePause = () => {
    setVideoPlaying(false)
  }

  const thumbnailPhotoUrl = getAssetUrl(
    data.video?.thumbnailPhotoAvailability,
    data.video?.thumbnailPhotoUrls,
    data.video?.thumbnailPhotoDataObject
  )
  const mediaUrl = getAssetUrl(data.video?.mediaAvailability, data.video?.mediaUrls, data.video?.mediaDataObject)

  return (
    <Container>
      <MediaWrapper>
        <Media>
          <PlayerContainer>
            {data ? (
              <VideoPlayer
                fluid
                isInBackground
                muted={soundMuted}
                playing={videoPlaying}
                posterUrl={thumbnailPhotoUrl}
                onDataLoaded={handlePlaybackDataLoaded}
                onPlay={handlePlay}
                onPause={handlePause}
                src={mediaUrl}
              />
            ) : (
              <PlayerPlaceholder />
            )}
          </PlayerContainer>
          {data && <HorizontalGradientOverlay />}
          <VerticalGradientOverlay />
        </Media>
      </MediaWrapper>
      <InfoContainer isLoading={!data}>
        <StyledChannelLink
          id={data?.video.channel.id}
          hideHandle
          overrideChannel={data?.video.channel}
          avatarSize="cover"
        />
        <TitleContainer>
          {data ? (
            <>
              <Link to={absoluteRoutes.viewer.video(data.video.id)}>
                <Title variant="h2">{data.video.title}</Title>
              </Link>
              <span>{data.coverDescription}</span>
            </>
          ) : (
            <>
              <TitlePlaceholder width={380} height={60} />
              <Placeholder width={300} height={20} bottomSpace={4} />
              <Placeholder width={200} height={20} />
            </>
          )}
        </TitleContainer>
        <ControlsContainer>
          <CSSTransition
            in={displayControls}
            timeout={parseInt(transitions.timings.loading)}
            classNames={transitions.names.fade}
            unmountOnExit
            appear
          >
            <ButtonsContainer>
              <PlayButton
                onClick={handlePlayPauseClick}
                icon={videoPlaying ? <SvgPlayerPause /> : <SvgPlayerPlay />}
                size="large"
              >
                {videoPlaying ? 'Pause' : 'Play'}
              </PlayButton>
              <SoundButton onClick={handleSoundToggleClick} size="large">
                {!soundMuted ? <SvgPlayerSoundOn /> : <SvgPlayerSoundOff />}
              </SoundButton>
            </ButtonsContainer>
          </CSSTransition>
        </ControlsContainer>
      </InfoContainer>
    </Container>
  )
}
