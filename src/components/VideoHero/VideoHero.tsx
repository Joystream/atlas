import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { VideoHeroData } from '@/api/featured'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { Button } from '@/shared/components/Button'
import { IconButton } from '@/shared/components/IconButton'
import { GridItem, LayoutGrid } from '@/shared/components/LayoutGrid'
import { SkeletonLoader } from '@/shared/components/SkeletonLoader'
import { Text } from '@/shared/components/Text'
import { SvgActionPlay } from '@/shared/icons/ActionPlay'
import { SvgActionSoundOff } from '@/shared/icons/ActionSoundOff'
import { SvgActionSoundOn } from '@/shared/icons/ActionSoundOn'
import { transitions } from '@/shared/theme'

import {
  BackgroundContainer,
  ButtonsContainer,
  Container,
  GradientOverlay,
  InfoContainer,
  StyledChannelLink,
  TitleContainer,
} from './VideoHero.style'

import { BackgroundVideoPlayer } from '../BackgroundVideoPlayer'

const VIDEO_PLAYBACK_DELAY = 1250

export type VideoHeroProps = {
  videoHeroData: VideoHeroData | null
}

export const VideoHero: React.FC<VideoHeroProps> = ({ videoHeroData }) => {
  const isCompact = useMediaMatch('sm')

  const [videoPlaying, setVideoPlaying] = useState(false)
  const [soundMuted, setSoundMuted] = useState(true)

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
      <BackgroundContainer>
        {videoHeroData && (
          <BackgroundVideoPlayer
            muted={soundMuted}
            playing={videoPlaying}
            poster={videoHeroData.thumbnailPhotoUrl || ''}
            onLoadedData={handlePlaybackDataLoaded}
            onPlay={() => setVideoPlaying(true)}
            onPause={() => setVideoPlaying(false)}
            onEnded={() => setVideoPlaying(false)}
            src={videoHeroData?.heroVideoCutUrl}
          />
        )}
        <GradientOverlay />
      </BackgroundContainer>
      <InfoContainer>
        <LayoutGrid>
          <GridItem colSpan={{ xxs: 12, xs: 10, sm: 6, md: 5, xl: 4, xxl: 3 }}>
            <StyledChannelLink variant="secondary" id={videoHeroData?.video.channel.id} />
            <TitleContainer>
              <SwitchTransition>
                <CSSTransition
                  key={videoHeroData ? 'data' : 'placeholder'}
                  classNames={transitions.names.fade}
                  timeout={parseInt(transitions.timings.regular)}
                >
                  {videoHeroData ? (
                    <Link to={absoluteRoutes.viewer.video(videoHeroData.video.id)}>
                      <Text variant={isCompact ? 'h2' : 'h4'}>{videoHeroData.heroTitle}</Text>
                    </Link>
                  ) : isCompact ? (
                    <SkeletonLoader height={48} width={360} />
                  ) : (
                    <>
                      <SkeletonLoader height={30} width="100%" bottomSpace={4} />
                      <SkeletonLoader height={30} width={240} />
                    </>
                  )}
                </CSSTransition>
              </SwitchTransition>
            </TitleContainer>
          </GridItem>
        </LayoutGrid>
        <SwitchTransition>
          <CSSTransition
            key={videoHeroData ? 'data' : 'placeholder'}
            classNames={transitions.names.fade}
            timeout={parseInt(transitions.timings.regular)}
          >
            {videoHeroData ? (
              <ButtonsContainer>
                <Button
                  size={isCompact ? 'large' : 'medium'}
                  fullWidth={!isCompact}
                  to={absoluteRoutes.viewer.video(videoHeroData.video.id)}
                  icon={<SvgActionPlay />}
                >
                  Play
                </Button>
                <IconButton size={isCompact ? 'large' : 'medium'} variant="secondary" onClick={handleSoundToggleClick}>
                  {!soundMuted ? <SvgActionSoundOn /> : <SvgActionSoundOff />}
                </IconButton>
              </ButtonsContainer>
            ) : (
              <ButtonsContainer>
                <SkeletonLoader width={isCompact ? '96px' : '100%'} height={isCompact ? '48px' : '40px'} />
                <SkeletonLoader width={isCompact ? '48px' : '40px'} height={isCompact ? '48px' : '40px'} />
              </ButtonsContainer>
            )}
          </CSSTransition>
        </SwitchTransition>
      </InfoContainer>
    </Container>
  )
}
