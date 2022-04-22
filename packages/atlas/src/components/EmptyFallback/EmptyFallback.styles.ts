import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { media, sizes } from '@/styles'

export type EmptyFallbackSizes = 'small' | 'large'

type ContainerProps = {
  variant?: EmptyFallbackSizes
  verticalCentered?: boolean
}

export const Container = styled.div<ContainerProps>`
  margin: ${sizes(10)} auto;
  display: grid;
  place-content: center;
  justify-items: center;
  height: ${({ verticalCentered }) => (verticalCentered ? '100%' : 'auto')};

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
