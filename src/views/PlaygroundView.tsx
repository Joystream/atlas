import React from 'react'
import { Button as _Button, Text } from '@/shared/components'
import styled from '@emotion/styled'

export const PlaygroundView = () => {
  return (
    <Container>
      <Text variant="h2">Internal testing view</Text>
      <div>
        <Button>I do nothing</Button>
      </div>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 2rem 2rem;
`

const Button = styled(_Button)`
  display: block;
`

export default PlaygroundView
