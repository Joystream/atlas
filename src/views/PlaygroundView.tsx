import React from 'react'
import { Routes, Route } from 'react-router-dom'
import styled from '@emotion/styled'
import { PlaygroundValidationForm } from './Playgrounds'
import { Text } from '@/shared/components'
import Link from '@/components/Link'
import { VideoMetadata } from './Playgrounds/VideoMetaData'

export const PlaygroundView = () => {
  return (
    <Container>
      <Text variant="h2">Internal testing view</Text>
      <LinksContainer>
        <Link to="./validation-form">Validation Form</Link>
        <Link to="./video-metadata">Video Metadata</Link>
        <Link to="./third">Third</Link>
      </LinksContainer>
      <Routes>
        <Route key="validation-form" path="/validation-form" element={<PlaygroundValidationForm />} />
        <Route key="second" path="/video-metadata" element={<VideoMetadata />} />
        <Route key="third" path="/third" element={<p>Third</p>} />
      </Routes>
    </Container>
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
