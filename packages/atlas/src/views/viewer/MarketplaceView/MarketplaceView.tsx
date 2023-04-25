import { FC } from 'react'

import { AllNftSection } from '@/components/AllNftSection/AllNftSection'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'
import { useHeadTags } from '@/hooks/useHeadTags'

import { FeaturedNftsSection } from './FeaturedNftsSection/FeaturedNftsSection'

export const MarketplaceView: FC = () => {
  const headTags = useHeadTags('Video NFTs')

  return (
    <VideoContentTemplate title="Video NFTs">
      {headTags}
      <FeaturedNftsSection />
      <AllNftSection />
    </VideoContentTemplate>
  )
}
