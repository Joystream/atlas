import React from 'react'
import styled from '@emotion/styled'
import { Text } from '@/shared/components'
import Link from '@/components/Link'
import { DraftsProvider } from '@/hooks'
import PlaygroundRouter from './PlaygroundRouter'

export const PlaygroundView = () => {
  return (
    <DraftsProvider>
      <Container>
        <Text variant="h2">Internal testing view</Text>
        <LinksContainer>
          <Link to="./validation-form">Validation Form</Link>
          <Link to="./drafts">Drafts</Link>
          <Link to="./video-metadata">Video Metadata</Link>
        </LinksContainer>
        <PlaygroundRouter />
      </Container>
    </DraftsProvider>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 2rem 2rem;
`

const LinksContainer = styled.div`
  display: flex;
  gap: 20px;
  a {
    font-size: 16px;
  }
`

export default PlaygroundView
