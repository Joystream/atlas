import styled from '@emotion/styled'

import { Svg404PatternBottomLeft, Svg404PatternTopRight, SvgSmallCursor } from '@/assets/illustrations'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'

const NotFoundView = () => {
  return (
    <>
      <StyledPattern1 />
      <StyledPattern2 />
      <Container>
        <InnerContainer>
          <SvgSmallCursor />
          <Text as="h1" align="center" variant="h600">
            You have reached <br /> the end of the Internet
          </Text>
          <Text as="p" margin={{ top: 4, bottom: 16 }} align="center" variant="t300" color="colorText">
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

export default NotFoundView
