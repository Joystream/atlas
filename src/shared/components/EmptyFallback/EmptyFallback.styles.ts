import styled from '@emotion/styled'

import { Text } from '@/shared/components'
import { colors, media, sizes } from '@/shared/theme'

import { EmptyFallbackSizes } from './EmptyFallback'

export const Container = styled.div<{ variant?: EmptyFallbackSizes }>`
  margin: ${({ variant }) => (variant === 'large' ? sizes(20) : sizes(13.5))} auto 0;
  display: grid;
  place-items: center;

  ${media.compact} {
    width: ${sizes(90)};
  }

  > svg {
    max-width: 650px;
  }
`

export const Message = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-bottom: ${sizes(6)};
`

export const Title = styled(Text)`
  line-height: 1.25;
  margin-top: ${sizes(10)};
`
export const Subtitle = styled(Text)<{ single?: boolean }>`
  margin-top: ${({ single }) => (single ? sizes(6) : sizes(2))};
  line-height: ${sizes(5)};
  font-size: ${({ single }) => (single ? '16px' : '14px')};
  color: ${({ single }) => (single ? colors.white : colors.gray[300])};
`
