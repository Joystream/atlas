import styled from '@emotion/styled'
import React from 'react'
import Lottie from 'react-lottie-player'

import * as loaderL from '@/shared/animations/loader-L.json'
import * as loaderM from '@/shared/animations/loader-M.json'
import * as loaderS from '@/shared/animations/loader-S.json'
import * as loaderXL from '@/shared/animations/loader-XL.json'
import * as loaderXS from '@/shared/animations/loader-XS.json'

export const Animations = () => {
  return (
    <Container>
      ANIMATIONS
      <Lottie
        loop
        play
        // @ts-ignore it has to be liek that
        animationData={loaderXL.default}
      />
      <Lottie
        loop
        play
        // @ts-ignore it has to be liek that
        animationData={loaderL.default}
      />
      <Lottie
        loop
        play
        // @ts-ignore it has to be liek that
        animationData={loaderM.default}
      />
      <Lottie
        loop
        play
        // @ts-ignore it has to be liek that
        animationData={loaderS.default}
      />
      <Lottie
        loop
        play
        // @ts-ignore it has to be liek that
        animationData={loaderXS.default}
      />
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-gap: 32px;
  justify-content: center;
  text-align: center;
  grid-template-rows: auto 1fr 1fr 64px 32px 48px 48px;
`
