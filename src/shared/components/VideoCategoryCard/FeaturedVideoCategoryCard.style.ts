import styled from '@emotion/styled'

import { colors, sizes, transitions } from '@/shared/theme'

import { Container, IconCircle } from './VideoCategoryCard.style'

import { Text } from '../Text'

type VariantProps = { variantCategory?: 'default' | 'compact' }

export const PlayerContainer = styled.div`
  transition: opacity ${transitions.timings.regular} ${transitions.easing};
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 0;
  opacity: 0.15;
`

export const FeaturedContainer = styled(Container)`
  position: relative;
  height: ${({ variantCategory }) => (variantCategory === 'default' ? '320px' : '256px')};
  padding: ${({ variantCategory }) => (variantCategory === 'default' ? sizes(8) : sizes(6))};
  align-items: end;

  &:hover {
    ${PlayerContainer} {
      opacity: 0.3;
    }
  }
`

export const FeaturedContent = styled.div<VariantProps>`
  z-index: 1;
  position: relative;
  display: grid;
  ${({ variantCategory }) => variantCategory === 'default' && 'grid-template-columns: 2fr 1fr'};
`

export const FeaturedIconCircle = styled(IconCircle)`
  background: ${({ color }) => color};
  margin-bottom: ${sizes(4)};

  path {
    fill: ${colors.black};
  }
`

export const FeaturedVideoTitleContainer = styled.div<VariantProps>`
  margin-top: ${({ variantCategory }) => (variantCategory === 'default' ? 0 : sizes(4))};
  display: grid;
  gap: ${sizes(1)};
  align-self: end;
  text-align: ${({ variantCategory }) => (variantCategory === 'default' ? 'right' : 'left')};
`

export const FeaturedVideoText = styled(Text)`
  color: ${colors.gray[200]};
`
