import { FC, ReactNode } from 'react'
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
  VideosNumberContainer,
} from './VideoCategoryCard.style'

export type VideoCategoryCardProps = {
  title: string
  icon: ReactNode
  coverImg: string
  color: string
  id: string
  videosTotalCount: number | undefined
  categoryVideosCount: number | undefined
  variant?: 'default' | 'compact'
  isLoading?: boolean
}

export const VideoCategoryCard: FC<VideoCategoryCardProps> = ({
  variant = 'default',
  isLoading,
  title,
  categoryVideosCount = 0,
  icon,
  videosTotalCount,
  coverImg,
  color,
  id,
}) => {
  // value from 1 to 100 percentage
  const pieChartValue = ((categoryVideosCount ?? 0) / (videosTotalCount || 1)) * 100

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
              <Text
                as="span"
                variant={variant === 'default' ? 'h500' : 'h300'}
                margin={{ bottom: variant === 'default' ? 6 : 3 }}
              >
                {title}
              </Text>
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
                  <Text as="span" variant={variant === 'default' ? 't200' : 't100'} color="colorText">
                    {categoryVideosCount} {categoryVideosCount === 1 ? 'video' : 'videos'}
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
