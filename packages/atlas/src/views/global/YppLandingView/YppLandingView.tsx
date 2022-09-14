import { FC } from 'react'
import { ParallaxProvider } from 'react-scroll-parallax'

import { useHeadTags } from '@/hooks/useHeadTags'

import { YppCardsSections } from './YppCardsSections'
import { YppFooter } from './YppFooter'
import { YppHero } from './YppHero'
import { YppRewardSection } from './YppRewardSection'
import { YppThreeStepsSection } from './YppThreeStepsSection'

export const YppLandingView: FC = () => {
  const headTags = useHeadTags('Youtube Partner Program')
  return (
    <>
      {headTags}
      <ParallaxProvider>
        <YppHero />
        <YppRewardSection />
        <YppThreeStepsSection />
        <YppCardsSections />
        <YppFooter />
      </ParallaxProvider>
    </>
  )
}
