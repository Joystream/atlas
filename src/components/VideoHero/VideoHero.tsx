import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

import { absoluteRoutes } from '@/config/routes'
import { AssetType, useAsset } from '@/providers'
import { GridItem, LayoutGrid, SkeletonLoader, VideoPlayer } from '@/shared/components'
import { SvgPlayerPause, SvgPlayerPlay, SvgPlayerSoundOff, SvgPlayerSoundOn } from '@/shared/icons'
import { transitions } from '@/shared/theme'

import {
  ButtonsContainer,
  Container,
  GradientOverlay,
  InfoContainer,
  Media,
  MediaWrapper,
  PlayButton,
  PlayerContainer,
  SoundButton,
  StyledChannelLink,
  Title,
  TitleContainer,
  TitleSkeletonLoader,
} from './VideoHero.style'
import { useVideoHero } from './VideoHeroData'

const VIDEO_PLAYBACK_DELAY = 1250

export const VideoHero: React.FC = () => {
  const coverVideo = useVideoHero()

  const [videoPlaying, setVideoPlaying] = useState(false)
  const [displayControls, setDisplayControls] = useState(false)
  const [soundMuted, setSoundMuted] = useState(true)
  const { url: thumbnailPhotoUrl } = useAsset({
    entity: coverVideo?.video,
    assetType: AssetType.THUMBNAIL,
  })

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

  return (
    <Container>
      <MediaWrapper>
        <Media>
          <PlayerContainer>
            {coverVideo && (
              <VideoPlayer
                fluid
                isInBackground
                muted={soundMuted}
                playing={videoPlaying}
                posterUrl={thumbnailPhotoUrl}
                onDataLoaded={handlePlaybackDataLoaded}
                onPlay={() => setVideoPlaying(true)}
                onPause={() => setVideoPlaying(false)}
                onEnd={() => setVideoPlaying(false)}
                src={coverVideo?.coverCutMediaUrl}
              />
            )}
          </PlayerContainer>
          <GradientOverlay />
        </Media>
      </MediaWrapper>
      <InfoContainer isLoading={!coverVideo}>
        <StyledChannelLink
          id={coverVideo?.video.channel.id}
          overrideChannel={coverVideo?.video.channel}
          avatarSize="small"
        />
        <LayoutGrid>
          <GridItem colSpan={{ base: 12, compact: 10, small: 8, medium: 5, xlarge: 4, xxlarge: 3 }}>
            <TitleContainer>
              {coverVideo ? (
                <>
                  <Link to={absoluteRoutes.viewer.video(coverVideo.video.id)}>
                    <Title variant="h2">{coverVideo.coverTitle}</Title>
                  </Link>
                </>
              ) : (
                <>
                  <TitleSkeletonLoader width={380} height={60} />
                  <SkeletonLoader width={300} height={20} bottomSpace={4} />
                  <SkeletonLoader width={200} height={20} />
                </>
              )}
            </TitleContainer>
          </GridItem>
        </LayoutGrid>
        <div>
          <CSSTransition
            in={displayControls}
            timeout={parseInt(transitions.timings.loading)}
            classNames={transitions.names.fade}
            unmountOnExit
            appear
          >
            <ButtonsContainer>
              <PlayButton onClick={handlePlayPauseClick} icon={videoPlaying ? <SvgPlayerPause /> : <SvgPlayerPlay />}>
                {videoPlaying ? 'Pause' : 'Play'}
              </PlayButton>
              <SoundButton variant="secondary" onClick={handleSoundToggleClick}>
                {!soundMuted ? <SvgPlayerSoundOn /> : <SvgPlayerSoundOff />}
              </SoundButton>
            </ButtonsContainer>
          </CSSTransition>
        </div>
      </InfoContainer>
    </Container>
  )
}
