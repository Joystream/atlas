import styled from '@emotion/styled'
import { FC } from 'react'

import { Svg404PatternBottomLeft, Svg404PatternTopRight, SvgSmallCursor } from '@/assets/illustrations'
import { Text } from '@/components/Text'

export const PaymentsView: FC = () => {
  return (
    <>
      <StyledPattern1 />
      <StyledPattern2 />
      <Container>
        <InnerContainer>
          {/* todo needs to be replaced with correct illustration */}
          <SvgSmallCursor />
          <Text as="h1" align="center" margin={{ top: 8 }} variant="h600">
            Creator tokens are coming later this year
          </Text>
          <Text as="p" margin={{ top: 4, bottom: 16 }} align="center" variant="t300" color="colorText">
            With Creator Tokens, channel owners are be able to mint their own personalised tokens and let their audience
            buy and hold a share in the channel.
          </Text>
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
  max-width: 640px;
`

// todo needs to be replacement with correct pattern
const StyledPattern1 = styled(Svg404PatternTopRight)`
  position: absolute;
  right: 0;
  top: 0;
`

// todo needs to be replacement with correct pattern
const StyledPattern2 = styled(Svg404PatternBottomLeft)`
  position: absolute;
  left: 0;
  bottom: 0;
`
