import styled from '@emotion/styled'
import loadable from '@loadable/component'
import React, { useEffect, useState } from 'react'

const LoadableLottie = loadable(() => import('react-lottie-player'), {
  fallback: <>LOADING LOTTIE</>,
})
export const Animations = () => {
  const [XL, setXL] = useState<any>(null)
  const [L, setL] = useState<any>(null)
  const [M, setM] = useState<any>(null)
  const [S, setS] = useState<any>(null)
  const [XS, setXS] = useState<any>(null)

  useEffect(() => {
    import('@/shared/animations/loader-XL.json').then((loader) => setXL(loader.default))
    import('@/shared/animations/loader-L.json').then((loader) => setL(loader.default))
    import('@/shared/animations/loader-M.json').then((loader) => setM(loader.default))
    import('@/shared/animations/loader-S.json').then((loader) => setS(loader.default))
    import('@/shared/animations/loader-XS.json').then((loader) => setXS(loader.default))
  }, [])

  return (
    <Container>
      ANIMATIONS
      <LoadableLottie loop play animationData={XL} />
      <LoadableLottie loop play animationData={L} />
      <LoadableLottie loop play animationData={M} />
      <LoadableLottie loop play animationData={S} />
      <LoadableLottie loop play animationData={XS} />
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
