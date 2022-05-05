import styled from '@emotion/styled'
import React from 'react'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgSmallCursor } from '@/components/_illustrations'

import { Pattern1 } from './Pattern1'
import { Pattern2 } from './Pattern2'

export const NotFoundView = () => {
  return (
    <>
      <StyledPattern1 />
      <StyledPattern2 />
      <Container>
        <InnerContainer>
          <SvgSmallCursor />
          <Text align="center" variant="h600">
            You have reached <br /> the end of the Internet
          </Text>
          <Text margin={{ top: 4, bottom: 16 }} align="center" variant="t300" secondary>
            This page does not exist, but you can find lots of other cool content on our platform!
          </Text>
          <Button size="large" to="/">
            Go to homepage
          </Button>
        </InnerContainer>
      </Container>
    </>
  )
}

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

const InnerContainer = styled.div`
  display: grid;
  justify-items: center;
  justify-content: center;
  max-width: 500px;
`

const StyledPattern1 = styled(Pattern1)`
  position: absolute;
  right: 0;
  top: 0;
`

const StyledPattern2 = styled(Pattern2)`
  position: absolute;
  left: 0;
  bottom: 0;
`
