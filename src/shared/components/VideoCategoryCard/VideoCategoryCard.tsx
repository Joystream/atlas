import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { SkeletonLoader, Text } from '@/shared/components'
import { SvgVideoCategoriesScienceAndTechnology } from '@/shared/icons/VideoCategoriesScienceAndTechnology'
import { sizes, transitions } from '@/shared/theme'

import {
  Container,
  Content,
  CoverImg,
  IconCircle,
  PieChart,
  PieSegment,
  Title,
  VideoCountContainer,
  VideosNumberContainer,
} from './VideoCategoryCard.style'

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
        <Container loading={loading} variantCategory={variant} color={color} {...rest}>
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

            <VideoCountContainer>
              {loading ? (
                <SkeletonLoader width="80px" height={variant === 'default' ? '20px' : '16px'} />
              ) : (
                <VideosNumberContainer>
                  <PieChart>
                    <PieSegment value={pieChartValue}></PieSegment>
                  </PieChart>
                  <Text variant={variant === 'default' ? 'body2' : 'caption'} secondary>
                    123 videos
                  </Text>
                </VideosNumberContainer>
              )}
            </VideoCountContainer>
          </Content>

          {variant === 'default' && !loading && (
            <CoverImg
              bgImgUrl={
                'https://eu-central-1.linodeobjects.com/atlas-assets/category-images/science-and-technology.webp'
              }
            ></CoverImg>
          )}
        </Container>
      </CSSTransition>
    </SwitchTransition>
  )
}
