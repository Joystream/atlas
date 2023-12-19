import { FC, useState } from 'react'

import { SvgActionCreatorToken, SvgActionPlay } from '@/assets/icons'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { StyledPageTabs } from '@/views/viewer/PortfolioView'

import { MarketplaceWrapper } from './MarketplaceView.styles'
import { MarketplaceCrtTab } from './tabs/MarketplaceCrtTab'
import { MarketplaceNftTab } from './tabs/MarketplaceNftTab'

const TABS = [
  {
    name: 'Video NFTs',
    description: 'Explore offers of non-fungible tokens for popular videos',
    icon: <SvgActionPlay />,
  },
  {
    name: 'Creator Tokens',
    description: 'Discover channels you can invest in',
    icon: <SvgActionCreatorToken />,
  },
]

export const MarketplaceView: FC = () => {
  const [tab, setTab] = useState(0)
  const smMatch = useMediaMatch('sm')

  return (
    <>
      <StyledPageTabs
        isBig
        tabs={TABS.map((tab) => (smMatch ? tab : { ...tab, description: '' }))}
        onSelectTab={setTab}
        selected={tab}
      />

      <MarketplaceWrapper>
        {tab === 0 && <MarketplaceNftTab />}
        {tab === 1 && <MarketplaceCrtTab />}
      </MarketplaceWrapper>
    </>
  )
}
