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
      </Container>
    </>
  )
}

const Container = styled.div`
  position: relative;
  left: 50%;
  top: 50%;
  display: grid;
  justify-items: center;
  justify-content: center;
  transform: translate(-50%, calc(-1 * (50vh - 50%)));
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
