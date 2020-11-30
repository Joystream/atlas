import React from 'react'
import styled from '@emotion/styled'

import { ReactComponent as EmptyStateIllustration } from '@/assets/empty-state-illustration.svg'
import { Text } from '@/shared/components'
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
  > p {
    margin: 0;
    line-height: 1.75;
    color: ${colors.gray[300]};
  }
`

const Title = styled(Text)`
  line-height: 1.25;
`

const EmptyFallback: React.FC = () => (
  <Container>
    <EmptyStateIllustration />
    <Message>
      <Title variant="h3">Sorry, we couldn&apos;t find any matches.</Title>
      <p>Please try a different keyword.</p>
    </Message>
  </Container>
)

export default EmptyFallback
