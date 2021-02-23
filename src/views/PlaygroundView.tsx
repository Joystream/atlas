import React from 'react'
import { Routes, Route } from 'react-router-dom'
import styled from '@emotion/styled'
import { Text } from '@/shared/components'
import Link from '@/components/Link'
import DraftsPlayground from './Playgrounds/DraftsPlayground'

export const PlaygroundView = () => {
  return (
    <Container>
      <Text variant="h2">Internal testing view</Text>
      <LinksContainer>
        <Link to="./first">First</Link>
        <Link to="./drafts">Drafts</Link>
        <Link to="./third">Third</Link>
      </LinksContainer>
      <Routes>
        <Route key="first" path="/first" element={<p>First</p>} />
        <Route key="drafts" path="/drafts" element={<DraftsPlayground />} />
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
