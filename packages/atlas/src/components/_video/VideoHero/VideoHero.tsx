import { FC, ReactNode, SyntheticEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { VideoHeroData } from '@/api/hooks/videoHero'
import { SvgActionChevronL, SvgActionPlayAlt, SvgActionSoundOff, SvgActionSoundOn } from '@/assets/icons'
import appKv from '@/assets/images/app-kv.webp'
import { IconWrapper } from '@/components/IconWrapper'
import { GridItem, LayoutGrid } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { Button, TextButton } from '@/components/_buttons/Button'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { BackgroundVideoPlayer } from '@/components/_video/BackgroundVideoPlayer'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { transitions } from '@/styles'

import {
  BackgroundContainer,
  ButtonsContainer,
  CategoryBackgroundImageOverlay,
  CategoryTitleWrapper,
  Container,
  GradientOverlay,
  InfoContainer,
  PlaceholderContainer,
  PlaceholderInfoContainer,
  StyledChannelLink,
  StyledLayoutGrid,
  TitleContainer,
} from './VideoHero.styles'
import { VideoHeroCategory } from './VideoHero.types'
import { VideoHeroHeader } from './VideoHeroHeader'
import { VideoHeroSlider, VideoHeroSliderProps } from './VideoHeroSlider'

export type VideoHeroProps = {
  loading?: boolean
  category?: VideoHeroCategory
  videoSlider?: VideoHeroSliderProps
  headerNode?: ReactNode
  withMuteButton?: boolean
  videoHeroData?: VideoHeroData | null
  onTimeUpdate?: (e: SyntheticEvent<HTMLVideoElement, Event>) => void
  onEnded?: (e: SyntheticEvent<HTMLVideoElement, Event>) => void
}

export const VideoHero: FC<VideoHeroProps> = ({
  videoHeroData,
  loading,
  videoSlider,
  category,
  withMuteButton,
  onTimeUpdate,
  onEnded,
}) => {
  const smMatch = useMediaMatch('sm')
  const xsMatch = useMediaMatch('xs')
  const isCategory = !!category

  const [soundMuted, setSoundMuted] = useState(true)

  const handleSoundToggleClick = () => {
    setSoundMuted(!soundMuted)
  }

  const handleEnded = (e: SyntheticEvent<HTMLVideoElement, Event>) => {
    onEnded?.(e)
  }
  const isVideoLoading = loading && !videoHeroData

  if (!isVideoLoading && !videoHeroData) {
    return (
      <PlaceholderContainer isCategory={isCategory}>
        <BackgroundContainer>
          {isCategory && category.coverImgUrl && (
            <CategoryBackgroundImageOverlay coverImgUrl={category.coverImgUrl} blurImage />
          )}
          {!isCategory && <CategoryBackgroundImageOverlay coverImgUrl={appKv} />}
          <GradientOverlay withSolidOverlay={isCategory} />
        </BackgroundContainer>
        {isCategory ? (
          <PlaceholderInfoContainer>
            <TextButton
              to={absoluteRoutes.viewer.discover()}
              size="medium"
              variant="secondary"
              icon={<SvgActionChevronL />}
            >
              Discover
            </TextButton>
            <CategoryTitleWrapper>
              <IconWrapper size={smMatch ? 'large' : 'medium'} icon={category.icon} backgroundColor={category.color} />
              <Text as="h2" variant={smMatch ? 'h700' : 'h500'} margin={{ left: smMatch ? 4 : 2 }}>
                {category.title}
              </Text>
            </CategoryTitleWrapper>
          </PlaceholderInfoContainer>
        ) : (
          <PlaceholderInfoContainer>
            <LayoutGrid>
              <GridItem colSpan={{ xxs: 12, sm: 6 }}>
                <Text as="h2" variant={smMatch ? 'h700' : 'h500'}>
                  Welcome to {atlasConfig.general.appName}
                </Text>
                {atlasConfig.general.appTagline && (
                  <Text as="p" variant="t200" margin={{ top: 4 }} color="colorText">
                    {atlasConfig.general.appTagline}
                  </Text>
                )}
              </GridItem>
            </LayoutGrid>
          </PlaceholderInfoContainer>
        )}
      </PlaceholderContainer>
    )
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
            poster={[videoHeroData.heroPosterUrl ?? '']}
            onEnded={handleEnded}
            src={[videoHeroData?.heroVideoCutUrl]}
          />
        )}
        <GradientOverlay withSolidOverlay />
      </BackgroundContainer>
      {videoSlider && (
        <VideoHeroSlider
          activeVideoIdx={videoSlider.activeVideoIdx}
          onTileClick={videoSlider.onTileClick}
          videos={videoSlider.videos}
        />
      )}
      {category?.title && <VideoHeroHeader icon={category.icon} title={category.title} loading={loading} />}
      <InfoContainer isCategory={isCategory}>
        <StyledLayoutGrid>
          <GridItem colSpan={{ xxs: 12, sm: 6 }}>
            <StyledChannelLink textSecondary id={videoHeroData?.video?.channel?.id} />
            <TitleContainer>
              <SwitchTransition>
                <CSSTransition
                  key={!isVideoLoading ? 'data' : 'placeholder'}
                  classNames={transitions.names.fade}
                  timeout={parseInt(transitions.timings.regular)}
                >
                  {videoHeroData ? (
                    <Link to={absoluteRoutes.viewer.video(videoHeroData.video?.id)}>
                      <Text as="h1" variant={smMatch ? 'h700' : 'h500'}>
                        {videoHeroData.heroTitle}
                      </Text>
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
            key={!isVideoLoading ? 'data' : 'placeholder'}
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
