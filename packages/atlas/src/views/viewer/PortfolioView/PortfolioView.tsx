import styled from '@emotion/styled'
import { useEffect, useState } from 'react'

import { SvgActionCreatorToken, SvgActionPlay } from '@/assets/icons'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { PageTabs } from '@/components/PageTabs'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { sizes } from '@/styles'
import { PortfolioNftTab } from '@/views/viewer/PortfolioView/tabs/PortfolioNftTab'
import { PortfolioTokenTab } from '@/views/viewer/PortfolioView/tabs/PortfolioTokenTab'

const TABS = [
  {
    name: 'Tokens',
    description: 'Manage & collect your funds',
    icon: <SvgActionCreatorToken />,
  },
  {
    name: 'Video NFTs',
    description: 'Browse your NFT collection',
    icon: <SvgActionPlay />,
  },
]

export const PortfolioView = () => {
  const [tab, setTab] = useState(0)
  const smMatch = useMediaMatch('sm')
  const { trackPageView } = useSegmentAnalytics()

  useEffect(() => {
    trackPageView('Portfolio', { tab: TABS[tab].name })
  }, [tab, trackPageView])

  return (
    <>
      <StyledPageTabs
        isBig
        tabs={TABS.map((tab) => (smMatch ? tab : { ...tab, description: '' }))}
        onSelectTab={setTab}
        selected={tab}
      />

      <StyledLimitedWidthContainer>
        {tab === 0 && <PortfolioTokenTab />}
        {tab === 1 && <PortfolioNftTab />}
      </StyledLimitedWidthContainer>
    </>
  )
}

export const StyledLimitedWidthContainer = styled(LimitedWidthContainer)`
  padding: ${sizes(12)} 0;
  display: flex;
  flex-direction: column;
  gap: ${sizes(12)};
`
export const StyledPageTabs = styled(PageTabs)`
  margin: 0 calc(-1 * var(--size-global-horizontal-padding));
`
