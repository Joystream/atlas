import { FC, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

import { SvgActionCreatorToken, SvgActionPlay } from '@/assets/icons'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useMountEffect } from '@/hooks/useMountEffect'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
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
] as const
type TabsNames = (typeof TABS)[number]['name']

const getTabIndex = (tabName: TabsNames, allTabs: typeof TABS): number =>
  allTabs.findIndex((tab) => tab.name === tabName)

export const MarketplaceView: FC = () => {
  const smMatch = useMediaMatch('sm')
  const [searchParams, setSearchParams] = useSearchParams()
  const { trackPageView } = useSegmentAnalytics()
  const currentTabName = searchParams.get('tab') as (typeof TABS)[number]['name'] | null
  const currentTab = currentTabName ? getTabIndex(currentTabName, TABS) : 0

  useMountEffect(() => {
    if (currentTab === -1) {
      setSearchParams({ 'tab': '0' }, { replace: true })
    } else {
      trackPageView(`${TABS[currentTab].name} Marketplace`)
    }
  })

  const handleChangeTab = useCallback(
    (idx: number) => {
      trackPageView(`${TABS[idx].name} Marketplace`)
      setSearchParams({ tab: TABS[idx].name })
    },
    [setSearchParams, trackPageView]
  )

  return (
    <>
      <StyledPageTabs
        isBig
        tabs={TABS.map((tab) => (smMatch ? tab : { ...tab, description: '' }))}
        onSelectTab={handleChangeTab}
        selected={currentTab}
      />

      <MarketplaceWrapper>
        {currentTab === 0 && <MarketplaceNftTab />}
        {currentTab === 1 && <MarketplaceCrtTab />}
      </MarketplaceWrapper>
    </>
  )
}
