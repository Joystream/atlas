import { FC } from 'react'

import { AllNftSection } from '@/components/AllNftSection/AllNftSection'
import { VideoContentTemplate } from '@/components/_templates/VideoContentTemplate'
import { useHeadTags } from '@/hooks/useHeadTags'

export const NftsView: FC = () => {
  const headTags = useHeadTags('Video NFTs')

  return (
    <VideoContentTemplate title="Video NFTs">
      {headTags}
      <AllNftSection />
    </VideoContentTemplate>
  )
}
