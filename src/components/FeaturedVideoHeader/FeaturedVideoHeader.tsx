import React, { useState } from 'react'
import {
  ChannelLink,
  Container,
  HorizontalGradientOverlay,
  InfoContainer,
  Media,
  MediaWrapper,
  PlayButton,
  PlayerContainer,
  SoundButton,
  StyledAvatar,
  TitleContainer,
  VerticalGradientOverlay,
  Title,
} from './FeaturedVideoHeader.style'
import { CSSTransition } from 'react-transition-group'
import { mockCoverVideo, mockCoverVideoChannel, mockCoverVideoMedia } from '@/mocking/data/mockCoverVideo'
import routes from '@/config/routes'
import { VideoPlayer } from '@/shared/components'
import { Link } from '@reach/router'
import { transitions } from '@/shared/theme'

const FeaturedVideoHeader: React.FC = () => {
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [initialLoadDone, setInitialLoadDone] = useState(false)
  const [soundMuted, setSoundMuted] = useState(true)

  const handlePlaybackDataLoaded = () => {
    setInitialLoadDone(true)
    setVideoPlaying(true)
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
            <VideoPlayer
              fluid
              isInBackground
              muted={soundMuted}
              playing={videoPlaying}
              posterUrl={mockCoverVideo.thumbnailUrl}
              onDataLoaded={handlePlaybackDataLoaded}
              onPlay={handlePlay}
              onPause={handlePause}
              src={mockCoverVideoMedia.coverCutLocation!}
            />
          </PlayerContainer>
          <HorizontalGradientOverlay />
          <VerticalGradientOverlay />
        </Media>
      </MediaWrapper>
      <InfoContainer>
        <ChannelLink to={routes.channel(mockCoverVideoChannel.id)}>
          <StyledAvatar img={mockCoverVideoChannel.avatarPhotoUrl} name={mockCoverVideoChannel.handle} />
        </ChannelLink>
        <TitleContainer>
          <Link to={routes.video(mockCoverVideo.id)}>
            <Title variant="h2">{mockCoverVideo.title}</Title>
          </Link>
          <span>{mockCoverVideo.description}</span>
        </TitleContainer>
        <CSSTransition
          in={initialLoadDone}
          timeout={parseInt(transitions.timings.loading)}
          classNames={transitions.names.fade}
        >
          <div>
            <PlayButton
              onClick={handlePlayPauseClick}
              icon={videoPlaying ? 'pause' : 'play'}
              disabled={!initialLoadDone}
              playing={videoPlaying}
            >
              {videoPlaying ? 'Pause' : 'Play'}
            </PlayButton>
            <SoundButton
              onClick={handleSoundToggleClick}
              icon={!soundMuted ? 'sound-on' : 'sound-off'}
              disabled={!initialLoadDone}
            />
          </div>
        </CSSTransition>
      </InfoContainer>
    </Container>
  )
}

export default FeaturedVideoHeader
