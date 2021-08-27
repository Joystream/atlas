import styled from '@emotion/styled'

import { media, sizes } from '@/shared/theme'

import { EmptyFallbackSizes } from './EmptyFallback'

import { Text } from '../Text'

export const Container = styled.div<{ variant?: EmptyFallbackSizes }>`
  margin: ${sizes(10)} auto;
  display: grid;
  place-items: center;

  ${media.xs} {
    width: ${({ variant }) => (variant === 'large' ? sizes(90) : 'auto')};
  }

  ${({ variant }) => `
    ${Title} {
      margin-top: ${sizes(variant === 'large' ? 10 : 6)};
  `}
`

export const Message = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`

export const Title = styled(Text)`
  line-height: 1.25;
`
export const Subtitle = styled(Text)`
  margin-top: ${sizes(2)};
  line-height: ${sizes(5)};
`

export const ButtonWrapper = styled.div`
  margin-top: ${sizes(6)};
`
