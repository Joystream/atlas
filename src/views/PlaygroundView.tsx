import React from 'react'
import { Routes, Route } from 'react-router-dom'
import styled from '@emotion/styled'
import { PlaygroundValidationForm, PlaygroundDrafts, VideoMetaData } from './Playgrounds'
import { Text } from '@/shared/components'
import Link from '@/components/Link'
import { DraftsProvider } from '@/hooks'

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
        <Routes>
          <Route key="validation-form" path="/validation-form" element={<PlaygroundValidationForm />} />
          <Route key="drafts" path="/drafts" element={<PlaygroundDrafts />} />
          <Route key="metadata" path="/video-metadata" element={<VideoMetaData />} />
        </Routes>
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
