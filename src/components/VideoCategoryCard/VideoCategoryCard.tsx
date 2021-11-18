import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useVideoCount } from '@/api/hooks'
import { absoluteRoutes } from '@/config/routes'
import { sizes, transitions } from '@/theme'
import { SentryLogger } from '@/utils/logs'

import {
  Content,
  CoverImg,
  CoverImgContainer,
  CoverImgOverlay,
  GeneralContainer,
  IconCircle,
  PieChart,
  PieSegment,
  Title,
  VideosNumberContainer,
} from './VideoCategoryCard.style'

import { Text } from '../Text'
import { SkeletonLoader } from '../_loaders/SkeletonLoader'

export type VideoCategoryCardProps = {
  title: string
  icon: React.ReactNode
  coverImg: string
  categoryId: string
  color: string
  id: string
  videosTotalCount: number | undefined
  variant?: 'default' | 'compact'
  loading?: boolean
}

export const VideoCategoryCard: React.FC<VideoCategoryCardProps> = ({
  variant = 'default',
  loading,
  title,
  categoryId,
  icon,
  videosTotalCount,
  coverImg,
  color,
  id,
}) => {
  const { videoCount, loading: loadingVidCount } = useVideoCount(
    {
      where: {
        categoryId_eq: categoryId,
      },
    },
    {
      onError: (error) =>
        SentryLogger.error(`Failed to fetch videos count of categoryId ${categoryId}`, 'VideoCategoryCard', error),
    }
  )

  // value from 1 to 100 percentage
  const pieChartValue = ((videoCount ?? 0) / (videosTotalCount ?? 1)) * 100
  const isLoading = loading || loadingVidCount || videosTotalCount === undefined
  return (
    <SwitchTransition>
      <CSSTransition
        key={isLoading ? 'placeholder' : 'content'}
        timeout={parseInt(transitions.timings.sharp)}
        classNames={transitions.names.fade}
      >
        <GeneralContainer
          to={absoluteRoutes.viewer.category(id)}
          isLoading={isLoading}
          variantCategory={variant}
          color={color}
        >
          <Content variantCategory={variant}>
            {isLoading ? (
              <SkeletonLoader bottomSpace={sizes(4)} width="40px" height="40px" rounded />
            ) : (
              <IconCircle color={color}>{icon}</IconCircle>
            )}

            {isLoading ? (
              <SkeletonLoader
                bottomSpace={variant === 'default' ? sizes(6) : sizes(4)}
                width="100%"
                height={variant === 'default' ? '32px' : '20px'}
              />
            ) : (
              <Title variantCategory={variant} variant={variant === 'default' ? 'h4' : 'h6'}>
                {title}
              </Title>
            )}

            <VideosNumberContainer>
              {isLoading ? (
                <SkeletonLoader width="80px" height={variant === 'default' ? '20px' : '16px'} />
              ) : (
                <>
                  <PieChart>
                    <PieSegment value={pieChartValue}></PieSegment>
                  </PieChart>
                  <Text variant={variant === 'default' ? 'body2' : 'caption'} secondary>
                    {videoCount} videos
                  </Text>
                </>
              )}
            </VideosNumberContainer>
          </Content>

          {variant === 'default' && !isLoading && (
            <CoverImgContainer>
              <CoverImgOverlay></CoverImgOverlay>
              <CoverImg bgImgUrl={coverImg} />
            </CoverImgContainer>
          )}
        </GeneralContainer>
      </CSSTransition>
    </SwitchTransition>
  )
}
