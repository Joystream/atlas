import styled from '@emotion/styled'
import React from 'react'

import { Text } from '@/shared/components/Text'
import { SvgEmptyStateIllustration } from '@/shared/illustrations'
import { colors, sizes } from '@/shared/theme'

import { StartNewSearch } from './SearchResults.style'

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
  margin-top: ${sizes(10)};
  margin-bottom: ${sizes(10)};
`

const Title = styled(Text)`
  line-height: 1.25;
`
const Subtitle = styled(Text)`
  width: 360px;
  line-height: 1.75;
  color: ${colors.gray[300]};
  margin-top: ${sizes(2)};
`

type EmptyFallback = {
  type: 'videos' | 'channels'
}

export const EmptyFallback: React.FC<EmptyFallback> = ({ type }) => (
  <Container>
    <SvgEmptyStateIllustration />
    <Message>
      <Title variant="h3">No {type} found</Title>
      <Subtitle>Please, try using different search terms or changing your filtering criteria</Subtitle>
      <StartNewSearch
        variant="secondary"
        size="large"
        onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: '/' }))}
      >
        Start new search
      </StartNewSearch>
    </Message>
  </Container>
)
