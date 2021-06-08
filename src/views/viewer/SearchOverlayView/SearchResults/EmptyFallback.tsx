import styled from '@emotion/styled'
import React from 'react'

import { Text } from '@/shared/components'
import { SvgEmptyStateIllustration } from '@/shared/illustrations'
import { sizes, colors } from '@/shared/theme'

const Container = styled.div`
  margin: ${sizes(20)} auto 0;
  display: grid;
  place-items: center;
  > svg {
    max-width: 650px;
  }
`

const Message = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-top: 90px;
  margin-bottom: ${sizes(10)};
`

const Title = styled(Text)`
  line-height: 1.25;
`
const Subtitle = styled(Text)`
  line-height: 1.75;
  color: ${colors.gray[300]};
`

const EmptyFallback: React.FC = () => (
  <Container>
    <SvgEmptyStateIllustration />
    <Message>
      <Title variant="h3">Sorry, we couldn&apos;t find any matches.</Title>
      <Subtitle>Please try a different keyword.</Subtitle>
    </Message>
  </Container>
)

export default EmptyFallback
