import { FC } from 'react'
import { ParallaxProvider } from 'react-scroll-parallax'

import { YppCardsSections } from './YppCardsSections'
import { YppFooter } from './YppFooter'
import { YppHero } from './YppHero'
import { YppThreeStepsSection } from './YppThreeStepsSection'

export const YppLandingView: FC = () => {
  return (
    <ParallaxProvider>
      <YppHero />
      <YppThreeStepsSection />
      <YppCardsSections />
      <YppFooter />
    </ParallaxProvider>
  )
}
