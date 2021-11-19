import styled from '@emotion/styled'
import React from 'react'

import { cVar } from '@/styles'

export const DesignTokens = () => {
  return (
    <>
      <TypographyH700>typographyDesktopH700</TypographyH700>
      <TypographyH100>typographyDesktopH100</TypographyH100>
      <TypographyT100>typographyDesktopT100</TypographyT100>
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
const TypographyH700 = styled.p`
  font: ${cVar('typographyDesktopH700')};
  letter-spacing: ${cVar('typographyDesktopH700LetterSpacing')};
  text-transform: ${cVar('typographyDesktopH700TextTransform')};
`
const TypographyH100 = styled.p`
  font: ${cVar('typographyDesktopH100')};
  letter-spacing: ${cVar('typographyDesktopH100LetterSpacing')};
  text-transform: ${cVar('typographyDesktopH100TextTransform')};
`
const TypographyT100 = styled.p`
  font: ${cVar('typographyDesktopT100')};
  letter-spacing: ${cVar('typographyDesktopT100LetterSpacing')};
  text-transform: ${cVar('typographyDesktopT100TextTransform')};
`

const GreenDiv = styled(Box)`
  background-color: ${cVar('colorCoreGreen800')};
  transition: background-color 200ms ${cVar('animationEasingBounce')};

  :hover {
    background-color: ${cVar('colorCoreGreen300')};
  }
`
const RedDiv = styled(Box)`
  background-color: ${cVar('colorBackgroundErrorMuted')};
  transition: background-color ${cVar('animationTransitionMedium')};

  :hover {
    background-color: ${cVar('colorBackgroundErrorStrong')};
  }
`
const AlphaContainer = styled.div`
  position: relative;
`

const AlphaDiv = styled(Box)`
  position: absolute;
  background-color: ${cVar('colorBackgroundElevatedAlpha')};
`
const AlphaTestDiv = styled.div`
  position: absolute;
  background-color: red;
  left: 30px;
  top: 10px;
  width: 200px;
  height: 100px;
`
