import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { BackgroundVideoPlayer } from '@/components/_video/BackgroundVideoPlayer'
import { absoluteRoutes } from '@/config/routes'
import { useHover } from '@/hooks/useHover'
import { sizes, transitions } from '@/theme'

import {
  FeaturedContainer,
  FeaturedContent,
  FeaturedIconCircle,
  FeaturedVideoText,
  FeaturedVideoTitleContainer,
  PlayerContainer,
} from './FeaturedVideoCategoryCard.style'

export type FeaturedVideoCategoryCardVariant = 'default' | 'compact'
export type FeaturedVideoCategoryCardProps = {
  title: string
  icon: React.ReactNode
  videoUrl: string
  videoTitle: string
  color: string
  variant?: FeaturedVideoCategoryCardVariant
  id: string
}

export const FeaturedVideoCategoryCard: React.FC<FeaturedVideoCategoryCardProps> = ({
  title,
  icon,
  videoUrl,
  videoTitle,
  color,
  variant = 'default',
  id,
}) => {
  const [hoverRef, isVideoHovering] = useHover<HTMLAnchorElement>()
  const isLoading = !title && !videoUrl && !icon

  return (
    <SwitchTransition>
      <CSSTransition
        key={isLoading ? 'placeholder' : 'content'}
        timeout={parseInt(transitions.timings.sharp)}
        classNames={transitions.names.fade}
      >
        <FeaturedContainer
          to={absoluteRoutes.viewer.category(id)}
          ref={hoverRef}
          isLoading={isLoading}
          variantCategory={variant}
          color={color}
        >
          <PlayerContainer>
            {
              <BackgroundVideoPlayer
                src={isLoading ? undefined : videoUrl}
                loop
                muted
                playing={variant === 'default' ? isVideoHovering : true}
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
