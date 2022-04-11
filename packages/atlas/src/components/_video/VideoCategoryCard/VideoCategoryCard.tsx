import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { sizes, transitions } from '@/styles'

import {
  CircleDefaultBackground,
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
  color: string
  id: string
  videosTotalCount: number | undefined
  categoryVideosCount: number | undefined
  variant?: 'default' | 'compact'
  isLoading?: boolean
}

export const VideoCategoryCard: React.FC<VideoCategoryCardProps> = ({
  variant = 'default',
  isLoading,
  title,
  categoryVideosCount,
  icon,
  videosTotalCount,
  coverImg,
  color,
  id,
}) => {
  // value from 1 to 100 percentage
  const pieChartValue = ((categoryVideosCount ?? 0) / (videosTotalCount ?? 1)) * 100

  const categoryUrl = id ? absoluteRoutes.viewer.category(id) : ''
  return (
    <SwitchTransition>
      <CSSTransition
        key={isLoading ? 'placeholder' : 'content'}
        timeout={parseInt(transitions.timings.sharp)}
        classNames={transitions.names.fade}
      >
        <GeneralContainer to={categoryUrl} isLoading={isLoading} variantCategory={variant} color={color}>
          <Content variantCategory={variant}>
            {isLoading ? (
              <SkeletonLoader bottomSpace={sizes(4)} width="40px" height="40px" rounded />
            ) : (
              <IconCircle color={color}>
                <CircleDefaultBackground color={color} />
                {icon}
              </IconCircle>
            )}

            {isLoading ? (
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
              {isLoading ? (
                <SkeletonLoader width="80px" height={variant === 'default' ? '20px' : '16px'} />
              ) : (
                <>
                  <PieChart>
                    <CircleDefaultBackground />
                    <PieSegment value={pieChartValue} />
                  </PieChart>
                  <Text variant={variant === 'default' ? 't200' : 't100'} secondary>
                    {categoryVideosCount} videos
                  </Text>
                </>
              )}
            </VideosNumberContainer>
          </Content>

          {variant === 'default' && !isLoading && (
            <CoverImgContainer>
              <CoverImgOverlay />
              <CoverImg bgImgUrl={coverImg} />
            </CoverImgContainer>
          )}
        </GeneralContainer>
      </CSSTransition>
    </SwitchTransition>
  )
}
