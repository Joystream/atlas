import React, { useState } from 'react'
import {
  Container,
  HorizontalGradientOverlay,
  InfoContainer,
  Media,
  MediaWrapper,
  PlayButton,
  PlayerContainer,
  SoundButton,
  StyledChannelLink,
  TitleContainer,
  VerticalGradientOverlay,
  Title,
  TitlePlaceholder,
  PlayerPlaceholder,
  ControlsContainer,
  ButtonsContainer,
} from './CoverVideo.style'
import { CSSTransition } from 'react-transition-group'
import routes from '@/config/routes'
import { Placeholder, VideoPlayer } from '@/shared/components'
import { Link } from 'react-router-dom'
import { transitions } from '@/shared/theme'
import { useCoverVideo } from '@/api/hooks'

const VIDEO_PLAYBACK_DELAY = 1250

const CoverVideo: React.FC = () => {
  const { data } = useCoverVideo()

  const [videoPlaying, setVideoPlaying] = useState(false)
  const [displayControls, setDisplayControls] = useState(false)
  const [soundMuted, setSoundMuted] = useState(true)

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
                posterUrl={data.video.thumbnailUrl}
                onDataLoaded={handlePlaybackDataLoaded}
                onPlay={handlePlay}
                onPause={handlePause}
                src={data.coverCutMedia.location}
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
              <Link to={routes.viewer.video(data.video.id)}>
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
                icon={videoPlaying ? 'pause' : 'play'}
                playing={videoPlaying}
                size="large"
              >
                {videoPlaying ? 'Pause' : 'Play'}
              </PlayButton>
              <SoundButton
                onClick={handleSoundToggleClick}
                icon={!soundMuted ? 'sound-on' : 'sound-off'}
                size="large"
              />
            </ButtonsContainer>
          </CSSTransition>
        </ControlsContainer>
      </InfoContainer>
    </Container>
  )
}

export default CoverVideo
