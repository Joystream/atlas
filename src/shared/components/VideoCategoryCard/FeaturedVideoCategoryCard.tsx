import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useHover } from '@/hooks/useHover'
import { sizes, transitions } from '@/shared/theme'

import {
  FeaturedContainer,
  FeaturedContent,
  FeaturedIconCircle,
  FeaturedVideoText,
  FeaturedVideoTitleContainer,
  PlayerContainer,
} from './FeaturedVideoCategoryCard.style'

import { SkeletonLoader } from '../SkeletonLoader'
import { Text } from '../Text'
import { VideoPlayer } from '../VideoPlayer'

export type FeaturedVideoCategoryCardVariant = 'default' | 'compact'
export type FeaturedVideoCategoryCardProps = {
  title: string
  icon: React.ReactNode
  videoUrl: string
  videoTitle: string
  color: string
  variant?: FeaturedVideoCategoryCardVariant
}

export const FeaturedVideoCategoryCard: React.FC<FeaturedVideoCategoryCardProps> = ({
  title,
  icon,
  videoUrl,
  videoTitle,
  color,
  variant = 'default',
}) => {
  const [hoverRef, isVideoHovering] = useHover<HTMLDivElement>()
  const isLoading = false

  return (
    <SwitchTransition>
      <CSSTransition
        key={isLoading ? 'placeholder' : 'content'}
        timeout={parseInt(transitions.timings.sharp)}
        classNames={transitions.names.fade}
      >
        <FeaturedContainer ref={hoverRef} isLoading={isLoading} variantCategory={variant} color={color}>
          <PlayerContainer>
            {
              <VideoPlayer
                videoStyle={{ objectFit: 'cover' }}
                loop
                fluid
                isInBackground
                muted={true}
                playing={variant === 'default' ? isVideoHovering : true}
                src={videoUrl}
              />
            }
          </PlayerContainer>

          <FeaturedContent variantCategory={variant}>
            <div>
              {isLoading ? (
                <SkeletonLoader bottomSpace={sizes(4)} width="40px" height="40px" rounded />
              ) : (
                <FeaturedIconCircle color={color}>{icon}</FeaturedIconCircle>
              )}

              {isLoading ? (
                <SkeletonLoader width="312px" height={variant === 'default' ? '40px' : '32px'} />
              ) : (
                <Text variant={variant === 'default' ? 'h3' : 'h4'}>{title}</Text>
              )}
            </div>

            {!isLoading && (
              <FeaturedVideoTitleContainer variantCategory={variant}>
                <FeaturedVideoText variant="caption" secondary>
                  Featured video
                </FeaturedVideoText>
                <Text variant="h6">{videoTitle}</Text>
              </FeaturedVideoTitleContainer>
            )}
          </FeaturedContent>
        </FeaturedContainer>
      </CSSTransition>
    </SwitchTransition>
  )
}
