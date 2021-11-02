import styled from '@emotion/styled'
import React from 'react'

export const DesignTokens = () => {
  return (
    <>
      <GreenDiv>--color-core-green-800</GreenDiv>
      <RedDiv>--color-background-error-muted</RedDiv>
      <AlphaContainer>
        <AlphaTestDiv />
        <AlphaDiv>--color-background-elevated-alpha</AlphaDiv>
      </AlphaContainer>
    </>
  )
}
const Box = styled.div`
  padding: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
`

const GreenDiv = styled(Box)`
  background-color: var(--color-core-green-800);
`
const RedDiv = styled(Box)`
  background-color: var(--color-background-error-muted);
`
const AlphaContainer = styled.div`
  position: relative;
`

const AlphaDiv = styled(Box)`
  position: absolute;
  background-color: var(--color-background-elevated-alpha);
`
const AlphaTestDiv = styled.div`
  position: absolute;
  background-color: red;
  left: 30px;
  top: 10px;
  width: 200px;
  height: 100px;
`
