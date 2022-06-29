import { FC, ReactNode, SyntheticEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { VideoHeroData } from '@/api/hooks'
import { GridItem } from '@/components/LayoutGrid'
import { Button } from '@/components/_buttons/Button'
import { SvgActionPlayAlt, SvgActionSoundOff, SvgActionSoundOn } from '@/components/_icons'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { BackgroundVideoPlayer } from '@/components/_video/BackgroundVideoPlayer'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { transitions } from '@/styles'

import {
  BackgroundContainer,
  ButtonsContainer,
  Container,
  GradientOverlay,
  InfoContainer,
  StyledChannelLink,
  StyledLayoutGrid,
  TitleContainer,
  TitleText,
} from './VideoHero.styles'

export type VideoHeroProps = {
  isCategory?: boolean
  headerNode?: ReactNode
  sliderNode?: ReactNode
  withMuteButton?: boolean
  videoHeroData?: VideoHeroData | null
  onTimeUpdate?: (e: SyntheticEvent<HTMLVideoElement, Event>) => void
  onEnded?: (e: SyntheticEvent<HTMLVideoElement, Event>) => void
}

export const VideoHero: FC<VideoHeroProps> = ({
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

  const handleEnded = (e: SyntheticEvent<HTMLVideoElement, Event>) => {
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
          <GridItem colSpan={{ xxs: 12, sm: 6 }}>
            <StyledChannelLink textSecondary id={videoHeroData?.video?.channel?.id} />
            <TitleContainer>
              <SwitchTransition>
                <CSSTransition
                  key={videoHeroData ? 'data' : 'placeholder'}
                  classNames={transitions.names.fade}
                  timeout={parseInt(transitions.timings.regular)}
                >
                  {videoHeroData ? (
                    <Link to={absoluteRoutes.viewer.video(videoHeroData.video?.id)}>
                      <TitleText as="h1" isCategory={isCategory} variant={smMatch ? 'h700' : 'h500'}>
                        {videoHeroData.heroTitle}
                      </TitleText>
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
                  to={absoluteRoutes.viewer.video(videoHeroData.video?.id)}
                  icon={<SvgActionPlayAlt />}
                >
                  Play
                </Button>
                {withMuteButton && (
                  <Button
                    icon={!soundMuted ? <SvgActionSoundOn /> : <SvgActionSoundOff />}
                    size={smMatch ? 'large' : 'medium'}
                    variant="secondary"
                    onClick={handleSoundToggleClick}
                  />
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
