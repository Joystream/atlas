import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { absoluteRoutes } from '@/config/routes'
import { AssetType, useAsset } from '@/providers/assets'
import { Button } from '@/shared/components/Button'
import { GridItem, LayoutGrid } from '@/shared/components/LayoutGrid'
import { SvgActionPlay } from '@/shared/icons/ActionPlay'
import { SvgActionSoundOff } from '@/shared/icons/ActionSoundOff'
import { SvgActionSoundOn } from '@/shared/icons/ActionSoundOn'

import {
  ButtonsContainer,
  ButtonsSpaceKeeper,
  Container,
  GradientOverlay,
  InfoContainer,
  Media,
  MediaWrapper,
  PlayerContainer,
  SoundButton,
  StyledChannelLink,
  Title,
  TitleContainer,
  TitleSkeletonLoader,
} from './VideoHero.style'
import { useVideoHero } from './VideoHeroData'

import { BackgroundVideoPlayer } from '../BackgroundVideoPlayer'

const VIDEO_PLAYBACK_DELAY = 1250

export const VideoHero: React.FC = () => {
  const coverVideo = useVideoHero()

  const [videoPlaying, setVideoPlaying] = useState(false)
  const [soundMuted, setSoundMuted] = useState(true)
  const { url: thumbnailPhotoUrl } = useAsset({
    entity: coverVideo?.video,
    assetType: AssetType.THUMBNAIL,
  })

  const handlePlaybackDataLoaded = () => {
    setTimeout(() => {
      setVideoPlaying(true)
    }, VIDEO_PLAYBACK_DELAY)
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
              <BackgroundVideoPlayer
                muted={soundMuted}
                playing={videoPlaying}
                poster={thumbnailPhotoUrl || ''}
                onLoadedData={handlePlaybackDataLoaded}
                onPlay={() => setVideoPlaying(true)}
                onPause={() => setVideoPlaying(false)}
                onEnded={() => setVideoPlaying(false)}
                src={coverVideo?.coverCutMediaUrl}
              />
            )}
          </PlayerContainer>
          <GradientOverlay />
        </Media>
      </MediaWrapper>
      <InfoContainer>
        <StyledChannelLink
          variant="secondary"
          id={coverVideo?.video.channel.id}
          overrideChannel={coverVideo?.video.channel}
          avatarSize="small"
        />
        <LayoutGrid>
          <GridItem colSpan={{ xxs: 12, xs: 10, sm: 6, md: 5, xl: 4, xxl: 3 }}>
            <TitleContainer>
              {coverVideo ? (
                <>
                  <Link to={absoluteRoutes.viewer.video(coverVideo.video.id)}>
                    <Title variant="h2">{coverVideo.coverTitle}</Title>
                  </Link>
                </>
              ) : (
                <>
                  <TitleSkeletonLoader height={34} />
                  <TitleSkeletonLoader height={34} />
                </>
              )}
            </TitleContainer>
          </GridItem>
        </LayoutGrid>
        <ButtonsSpaceKeeper>
          {coverVideo && (
            <ButtonsContainer>
              <Button
                size="large"
                to={absoluteRoutes.viewer.video(coverVideo ? coverVideo.video.id : '')}
                icon={<SvgActionPlay />}
              >
                Play
              </Button>
              <SoundButton size="large" variant="secondary" onClick={handleSoundToggleClick}>
                {!soundMuted ? <SvgActionSoundOn /> : <SvgActionSoundOff />}
              </SoundButton>
            </ButtonsContainer>
          )}
        </ButtonsSpaceKeeper>
      </InfoContainer>
    </Container>
  )
}
