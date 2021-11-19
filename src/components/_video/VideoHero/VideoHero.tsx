import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { VideoHeroData } from '@/api/featured'
import { GridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { IconButton } from '@/components/_buttons/IconButton'
import { SvgActionPlay } from '@/components/_icons/ActionPlay'
import { SvgActionSoundOff } from '@/components/_icons/ActionSoundOff'
import { SvgActionSoundOn } from '@/components/_icons/ActionSoundOn'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { BackgroundVideoPlayer } from '@/components/_video/BackgroundVideoPlayer'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { transitions } from '@/theme'

import {
  BackgroundContainer,
  ButtonsContainer,
  Container,
  GradientOverlay,
  InfoContainer,
  StyledChannelLink,
  StyledLayoutGrid,
  TitleContainer,
} from './VideoHero.styles'

export type VideoHeroProps = {
  isCategory?: boolean
  headerNode?: React.ReactNode
  sliderNode?: React.ReactNode
  withMuteButton?: boolean
  videoHeroData: VideoHeroData | null
  onTimeUpdate?: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => void
  onEnded?: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => void
}

export const VideoHero: React.FC<VideoHeroProps> = ({
  videoHeroData = null,
  headerNode,
  isCategory,
  sliderNode,
  withMuteButton,
  onTimeUpdate,
  onEnded,
}) => {
  const smMatch = useMediaMatch('sm')
  const xsMatch = useMediaMatch('xs')

  const [soundMuted, setSoundMuted] = useState(true)

  const handleSoundToggleClick = () => {
    setSoundMuted(!soundMuted)
  }

  const handleEnded = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    onEnded?.(e)
  }

  return (
    <Container isCategory={isCategory}>
      <BackgroundContainer isCategory={isCategory}>
        {videoHeroData && (
          <BackgroundVideoPlayer
            preload="metadata"
            muted={soundMuted}
            autoPlay
            onTimeUpdate={onTimeUpdate}
            poster={videoHeroData.heroPosterUrl ?? undefined}
            onEnded={handleEnded}
            src={videoHeroData?.heroVideoCutUrl}
          />
        )}
        <GradientOverlay />
      </BackgroundContainer>
      {sliderNode && sliderNode}
      {headerNode && headerNode}
      <InfoContainer isCategory={isCategory}>
        <StyledLayoutGrid>
          <GridItem colSpan={{ xxs: 12, xs: 10, sm: 6, md: 5, xl: 4, xxl: 3 }}>
            <StyledChannelLink textSecondary id={videoHeroData?.video.channel.id} />
            <TitleContainer>
              <SwitchTransition>
                <CSSTransition
                  key={videoHeroData ? 'data' : 'placeholder'}
                  classNames={transitions.names.fade}
                  timeout={parseInt(transitions.timings.regular)}
                >
                  {videoHeroData ? (
                    <Link to={absoluteRoutes.viewer.video(videoHeroData.video.id)}>
                      <Text variant={smMatch ? 'h2' : 'h4'}>{videoHeroData.heroTitle}</Text>
                    </Link>
                  ) : smMatch ? (
                    <SkeletonLoader height={48} width={360} />
                  ) : (
                    <div>
                      <SkeletonLoader height={30} width="100%" bottomSpace={4} />
                      <SkeletonLoader height={30} width={240} />
                    </div>
                  )}
                </CSSTransition>
              </SwitchTransition>
            </TitleContainer>
          </GridItem>
        </StyledLayoutGrid>
        <SwitchTransition>
          <CSSTransition
            key={videoHeroData ? 'data' : 'placeholder'}
            classNames={transitions.names.fade}
            timeout={parseInt(transitions.timings.regular)}
          >
            {videoHeroData ? (
              <ButtonsContainer>
                <Button
                  size={xsMatch ? 'large' : 'medium'}
                  fullWidth={!xsMatch}
                  to={absoluteRoutes.viewer.video(videoHeroData.video.id)}
                  icon={<SvgActionPlay />}
                >
                  Play
                </Button>
                {withMuteButton && (
                  <IconButton size={smMatch ? 'large' : 'medium'} variant="secondary" onClick={handleSoundToggleClick}>
                    {!soundMuted ? <SvgActionSoundOn /> : <SvgActionSoundOff />}
                  </IconButton>
                )}
              </ButtonsContainer>
            ) : (
              <ButtonsContainer>
                <SkeletonLoader width={xsMatch ? '96px' : '100%'} height={xsMatch ? '48px' : '40px'} />
                {withMuteButton && (
                  <SkeletonLoader width={smMatch ? '48px' : '40px'} height={smMatch ? '48px' : '40px'} />
                )}
              </ButtonsContainer>
            )}
          </CSSTransition>
        </SwitchTransition>
      </InfoContainer>
    </Container>
  )
}
