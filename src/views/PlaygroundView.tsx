import React from 'react'
import { Routes, Route } from 'react-router-dom'
import styled from '@emotion/styled'
import PlaygroundForm from './PlaygroundForm'
import { Text } from '@/shared/components'
import Link from '@/components/Link'

export const PlaygroundView = () => {
  return (
    <Container>
      <Text variant="h2">Internal testing view</Text>
      <LinksContainer>
        <Link to="./form">Form Validation</Link>
        <Link to="./second">Second</Link>
        <Link to="./third">Third</Link>
      </LinksContainer>
      <Routes>
        <Route key="form" path="/form" element={<PlaygroundForm />} />
        <Route key="second" path="/second" element={<p>Second</p>} />
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
