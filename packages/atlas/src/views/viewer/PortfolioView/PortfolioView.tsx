import styled from '@emotion/styled'
import { useState } from 'react'

import { SvgActionCreatorToken, SvgActionPlay } from '@/assets/icons'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { PageTabs } from '@/components/PageTabs'
import { sizes } from '@/styles'
import { PortfolioTokenTab } from '@/views/viewer/PortfolioView/tabs/PortfolioTokenTab'

const emptySpace = Array.from({ length: 20 }, () => ' ').join('')

const TABS = [
  {
    name: 'Tokens',
    description: 'Manage & collect your funds' + emptySpace,
    icon: <SvgActionCreatorToken />,
  },
  {
    name: 'Video NFTs',
    description: 'Browse your NFT collection' + emptySpace,
    icon: <SvgActionPlay />,
  },
]

export const PortfolioView = () => {
  const [tab, setTab] = useState(0)

  return (
    <>
      <StyledPageTabs isBig tabs={TABS} onSelectTab={setTab} selected={tab} />

      <StyledLimitedWidthContainer>{tab === 0 && <PortfolioTokenTab />}</StyledLimitedWidthContainer>
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
