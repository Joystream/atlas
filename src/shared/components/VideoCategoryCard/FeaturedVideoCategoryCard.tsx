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

export type Variant = 'default' | 'compact'
export type FeaturedVideoCategoryCardProps = {
  title: string
  icon: React.ReactNode
  videoUrl: string
  videoTitle: string
  color: string
  variant?: Variant
  loading?: boolean
}

export const FeaturedVideoCategoryCard: React.FC<FeaturedVideoCategoryCardProps> = ({
  title,
  icon,
  videoUrl,
  videoTitle,
  color,
  variant = 'default',
  loading,
}) => {
  const [hoverRef, isVideoHovering] = useHover<HTMLDivElement>()
  return (
    <SwitchTransition>
      <CSSTransition
        key={loading ? 'placeholder' : 'content'}
        timeout={parseInt(transitions.timings.sharp)}
        classNames={transitions.names.fade}
      >
        <FeaturedContainer ref={hoverRef} loading={loading} variantCategory={variant} color={color}>
          <PlayerContainer>
            {!loading && (
              <VideoPlayer
                startTime={25} // TODO: remove this before merge
                videoStyle={{ objectFit: 'cover' }}
                loop
                fluid
                isInBackground
                muted={true}
                playing={variant === 'default' ? isVideoHovering : true}
                src={videoUrl}
              />
            )}
          </PlayerContainer>

          <FeaturedContent variantCategory={variant}>
            <div>
              {loading ? (
                <SkeletonLoader bottomSpace={sizes(4)} width="40px" height="40px" rounded />
              ) : (
                <FeaturedIconCircle color={color}>{icon}</FeaturedIconCircle>
              )}

              {loading ? (
                <SkeletonLoader width="312px" height={variant === 'default' ? '40px' : '32px'} />
              ) : (
                <Text variant={variant === 'default' ? 'h3' : 'h4'}>{title}</Text>
              )}
            </div>

            {!loading && (
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
