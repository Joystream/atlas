import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useVideoCount } from '@/api/hooks'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { sizes, transitions } from '@/styles'
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

export type VideoCategoryCardProps = {
  title: string
  icon: React.ReactNode
  coverImg: string
  categoryId: string
  color: string
  id: string
  videosTotalCount: number | undefined
  variant?: 'default' | 'compact'
  isLoading?: boolean
}

export const VideoCategoryCard: React.FC<VideoCategoryCardProps> = ({
  variant = 'default',
  isLoading,
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
  const loading = isLoading || loadingVidCount || videosTotalCount === undefined
  const categoryUrl = id ? absoluteRoutes.viewer.category(id) : ''
  return (
    <SwitchTransition>
      <CSSTransition
        key={loading ? 'placeholder' : 'content'}
        timeout={parseInt(transitions.timings.sharp)}
        classNames={transitions.names.fade}
      >
        <GeneralContainer to={categoryUrl} isLoading={loading} variantCategory={variant} color={color}>
          <Content variantCategory={variant}>
            {loading ? (
              <SkeletonLoader bottomSpace={sizes(4)} width="40px" height="40px" rounded />
            ) : (
              <IconCircle color={color}>{icon}</IconCircle>
            )}

            {loading ? (
              <SkeletonLoader
                bottomSpace={variant === 'default' ? sizes(6) : sizes(4)}
                width="100%"
                height={variant === 'default' ? '32px' : '20px'}
              />
            ) : (
              <Title variantCategory={variant} variant={variant === 'default' ? 'h500' : 'h300'}>
                {title}
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
                  <Text variant={variant === 'default' ? 't200' : 't100'} secondary>
                    {videoCount} videos
                  </Text>
                </>
              )}
            </VideosNumberContainer>
          </Content>

          {variant === 'default' && !loading && (
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
