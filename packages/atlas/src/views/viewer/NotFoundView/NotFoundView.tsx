import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { Svg404PatternBottomLeft, Svg404PatternTopRight, SvgSmallCursor } from '@/components/_illustrations'

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
          <Text margin={{ top: 4, bottom: 16 }} align="center" variant="t300" color="default">
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

const StyledPattern1 = styled(Svg404PatternTopRight)`
  position: absolute;
  right: 0;
  top: 0;
`

const StyledPattern2 = styled(Svg404PatternBottomLeft)`
  position: absolute;
  left: 0;
  bottom: 0;
`
