import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useHover } from '@/hooks/useHover'
import { SvgVideoCategoriesScienceAndTechnology } from '@/shared/icons/VideoCategoriesScienceAndTechnology'
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

export type FeaturedVideoCategoryCardProps = {
  variant?: 'default' | 'compact'
  loading?: boolean
  color: string
}

export const FeaturedVideoCategoryCard: React.FC<FeaturedVideoCategoryCardProps> = ({
  variant = 'default',
  loading,
  color,
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
                videoStyle={{ objectFit: 'cover' }}
                loop
                fluid
                isInBackground
                muted={true}
                playing={variant === 'default' ? isVideoHovering : true}
                src={
                  'https://sumer-dev-2.joystream.app/storage/asset/v0/5Fbef6KfEP3ncHxroVsdWQF6gLb8ph47dcAmzWptjuMMWHnP'
                }
              />
            )}
          </PlayerContainer>

          <FeaturedContent variantCategory={variant}>
            <div>
              {loading ? (
                <SkeletonLoader bottomSpace={sizes(4)} width="40px" height="40px" rounded />
              ) : (
                <FeaturedIconCircle color={color}>
                  <SvgVideoCategoriesScienceAndTechnology />
                </FeaturedIconCircle>
              )}

              {loading ? (
                <SkeletonLoader width="312px" height={variant === 'default' ? '40px' : '32px'} />
              ) : (
                <Text variant={variant === 'default' ? 'h3' : 'h4'}>Science & Techology</Text>
              )}
            </div>

            {!loading && (
              <FeaturedVideoTitleContainer variantCategory={variant}>
                <FeaturedVideoText variant="caption" secondary>
                  Featured video
                </FeaturedVideoText>
                <Text variant="h6">KOIOS Blockchain Week</Text>
              </FeaturedVideoTitleContainer>
            )}
          </FeaturedContent>
        </FeaturedContainer>
      </CSSTransition>
    </SwitchTransition>
  )
}
