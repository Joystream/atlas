import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useHover } from '@/hooks/useHover'
import { SvgVideoCategoriesScienceAndTechnology } from '@/shared/icons/VideoCategoriesScienceAndTechnology'
import { sizes, transitions } from '@/shared/theme'

import {
  Content,
  CoverImg,
  CoverImgContainer,
  CoverImgOverlay,
  FeaturedContainer,
  FeaturedContent,
  FeaturedIconCircle,
  FeaturedVideoText,
  FeaturedVideoTitleContainer,
  GeneralContainer,
  IconCircle,
  PieChart,
  PieSegment,
  PlayerContainer,
  Title,
  VideosNumberContainer,
} from './VideoCategoryCard.style'

import { SkeletonLoader } from '../SkeletonLoader'
import { Text } from '../Text'
import { VideoPlayer } from '../VideoPlayer'

export type VideoCategoryCardProps = {
  variant?: 'default' | 'compact'
  loading?: boolean
  color: string
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

export const VideoCategoryCard: React.FC<VideoCategoryCardProps> = ({
  variant = 'default',
  loading,
  color,
  ...rest
}) => {
  // value from 1 to 100
  const pieChartValue = 15
  return (
    <SwitchTransition>
      <CSSTransition
        key={loading ? 'placeholder' : 'content'}
        timeout={parseInt(transitions.timings.sharp)}
        classNames={transitions.names.fade}
      >
        <GeneralContainer loading={loading} variantCategory={variant} color={color} {...rest}>
          <Content variantCategory={variant}>
            {loading ? (
              <SkeletonLoader bottomSpace={sizes(4)} width="40px" height="40px" rounded />
            ) : (
              <IconCircle color={color}>
                <SvgVideoCategoriesScienceAndTechnology />
              </IconCircle>
            )}

            {loading ? (
              <SkeletonLoader
                bottomSpace={variant === 'default' ? sizes(6) : sizes(4)}
                width="192px"
                height={variant === 'default' ? '32px' : '20px'}
              />
            ) : (
              <Title variantCategory={variant} variant={variant === 'default' ? 'h4' : 'h6'}>
                Science & Techology
              </Title>
            )}

            <VideosNumberContainer>
              {loading ? (
                <SkeletonLoader width="80px" height={variant === 'default' ? '20px' : '16px'} />
              ) : (
                <>
                  <PieChart>
                    <PieSegment value={pieChartValue}></PieSegment>
                  </PieChart>
                  <Text variant={variant === 'default' ? 'body2' : 'caption'} secondary>
                    123 videos
                  </Text>
                </>
              )}
            </VideosNumberContainer>
          </Content>

          {variant === 'default' && !loading && (
            <CoverImgContainer>
              <CoverImgOverlay></CoverImgOverlay>
              <CoverImg
                bgImgUrl={
                  'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/science-and-technology.webp'
                }
              ></CoverImg>
            </CoverImgContainer>
          )}
        </GeneralContainer>
      </CSSTransition>
    </SwitchTransition>
  )
}

export const FeaturedVideoCategoryCard: React.FC<VideoCategoryCardProps> = ({
  variant = 'default',
  loading,
  color,
  ...rest
}) => {
  const [hoverRef, isVideoHovering] = useHover<HTMLDivElement>()
  return (
    <SwitchTransition>
      <CSSTransition
        key={loading ? 'placeholder' : 'content'}
        timeout={parseInt(transitions.timings.sharp)}
        classNames={transitions.names.fade}
      >
        <FeaturedContainer ref={hoverRef} loading={loading} variantCategory={variant} color={color} {...rest}>
          <PlayerContainer>
            {!loading && (
              <VideoPlayer
                videoStyle={{ objectFit: 'cover' }}
                loop
                fluid
                isInBackground
                muted={true}
                playing={isVideoHovering}
                src={
                  'https://sumer-dev-2.joystream.app/storage/asset/v0/5FfYnDTjhkBSqbiUxmTBugtBLGKWrbhsENgTbgfRDbuuNzkQ'
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
                <FeaturedVideoText variant={'caption'} secondary>
                  Featured video
                </FeaturedVideoText>
                <Text variant={'h6'}>KOIOS Blockchain Week</Text>
              </FeaturedVideoTitleContainer>
            )}
          </FeaturedContent>
        </FeaturedContainer>
      </CSSTransition>
    </SwitchTransition>
  )
}
