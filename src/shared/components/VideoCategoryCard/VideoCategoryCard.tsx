import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { sizes, transitions } from '@/shared/theme'

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

import { SkeletonLoader } from '../SkeletonLoader'
import { Text } from '../Text'

export type VideoCategoryCardProps = {
  title: string
  icon: React.ReactNode
  coverImg: string
  color: string
  variant?: 'default' | 'compact'
  loading?: boolean
}

export const VideoCategoryCard: React.FC<VideoCategoryCardProps> = ({
  variant = 'default',
  loading,
  title,
  icon,
  coverImg,
  color,
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
        <GeneralContainer loading={loading} variantCategory={variant} color={color}>
          <Content variantCategory={variant}>
            {loading ? (
              <SkeletonLoader bottomSpace={sizes(4)} width="40px" height="40px" rounded />
            ) : (
              <IconCircle color={color}>{icon}</IconCircle>
            )}

            {loading ? (
              <SkeletonLoader
                bottomSpace={variant === 'default' ? sizes(6) : sizes(4)}
                width="192px"
                height={variant === 'default' ? '32px' : '20px'}
              />
            ) : (
              <Title variantCategory={variant} variant={variant === 'default' ? 'h4' : 'h6'}>
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
              <CoverImg bgImgUrl={coverImg} />
            </CoverImgContainer>
          )}
        </GeneralContainer>
      </CSSTransition>
    </SwitchTransition>
  )
}
