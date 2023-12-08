import { useCallback, useState } from 'react'

import { useGetFullCreatorTokenQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { SvgActionEdit, SvgActionLinkUrl } from '@/assets/icons'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Tabs } from '@/components/Tabs'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { CloseMarketButton } from '@/components/_crt/CloseMarketButton'
import { CloseRevenueShareButton } from '@/components/_crt/CloseRevenueShareButton'
import { RevenueShareModalButton } from '@/components/_crt/RevenueShareModalButton'
import { StartSaleOrMarketButton } from '@/components/_crt/StartSaleOrMarketButton/StartSaleOrMarketButton'
import { absoluteRoutes } from '@/config/routes'
import { useUser } from '@/providers/user/user.hooks'
import { HeaderContainer, MainContainer, TabsContainer } from '@/views/studio/CrtDashboard/CrtDashboard.styles'
import { CrtDashboardMainTab } from '@/views/studio/CrtDashboard/tabs/CrtDashboardMainTab'
import { CrtHoldersTab } from '@/views/studio/CrtDashboard/tabs/CrtHoldersTab'
import { CrtMarketTab } from '@/views/studio/CrtDashboard/tabs/CrtMarketTab'
import { CrtRevenueTab } from '@/views/studio/CrtDashboard/tabs/CrtRevenueTab'

import { TABS } from './CrtDashboard.types'

type TabsNames = typeof TABS[number]

const getTabIndex = (tabName: TabsNames, allTabs: { name: TabsNames }[]): number =>
  allTabs.findIndex((tab) => tab.name === tabName)

export const CrtDashboard = () => {
  const [currentTab, setCurrentTab] = useState<number>(0)
  const { activeChannel } = useUser()
  const { data } = useGetFullCreatorTokenQuery({
    variables: {
      id: activeChannel?.creatorToken?.token.id ?? '',
    },
  })
  const handleChangeTab = useCallback((idx: number) => {
    setCurrentTab(idx)
  }, [])
  const hasOpenMarket = data?.creatorTokenById?.ammCurves.some((curve) => !curve.finalized)
  const mappedTabs = TABS.filter((tab) => (hasOpenMarket ? true : tab !== 'Market')).map((tab) => ({ name: tab }))

  if (!data?.creatorTokenById) {
    return null
  }

  const activeRevenueShare = data.creatorTokenById.revenueShares.find((revenueShare) => !revenueShare.finalized)

  return (
    <LimitedWidthContainer big>
      <MainContainer>
        <HeaderContainer>
          <Text variant="h700" as="h1">
            ${data.creatorTokenById.symbol ?? 'N/A'}
          </Text>
          <Button
            to={absoluteRoutes.viewer.channel(data.creatorTokenById.channel?.channel.id, { tab: 'Token' })}
            variant="tertiary"
            icon={<SvgActionLinkUrl />}
            iconPlacement="right"
          >
            See your token
          </Button>
        </HeaderContainer>

        <TabsContainer>
          <Tabs initialIndex={0} selected={currentTab} tabs={mappedTabs} onSelectTab={handleChangeTab} />
          {currentTab === getTabIndex('Dashboard', mappedTabs) && (
            <>
              <Button to={absoluteRoutes.studio.crtTokenEdit()} variant="secondary" icon={<SvgActionEdit />}>
                Edit token page
              </Button>
              {!hasOpenMarket ? (
                <StartSaleOrMarketButton tokenName={data.creatorTokenById.symbol ?? 'N/A'} />
              ) : (
                <CloseMarketButton channelId={activeChannel?.id ?? '-1'} />
              )}
            </>
          )}
          {currentTab === getTabIndex('Market', mappedTabs) && (
            <CloseMarketButton channelId={activeChannel?.id ?? '-1'} />
          )}
          {currentTab === getTabIndex('Revenue share', mappedTabs) && (
            <>
              {!activeRevenueShare ? (
                <RevenueShareModalButton token={data.creatorTokenById} />
              ) : (
                <CloseRevenueShareButton revenueShare={activeRevenueShare} />
              )}
            </>
          )}
        </TabsContainer>
        {currentTab === getTabIndex('Dashboard', mappedTabs) && (
          <CrtDashboardMainTab
            hasOpenedMarket={!!hasOpenMarket}
            token={data.creatorTokenById}
            onTabChange={(tabName) => setCurrentTab(mappedTabs.findIndex((tab) => tab.name === tabName))}
          />
        )}
        {currentTab === getTabIndex('Market', mappedTabs) && <CrtMarketTab token={data.creatorTokenById} />}
        {currentTab === getTabIndex('Holders', mappedTabs) && <CrtHoldersTab token={data.creatorTokenById} />}
        {currentTab === getTabIndex('Revenue share', mappedTabs) && <CrtRevenueTab token={data.creatorTokenById} />}
      </MainContainer>
    </LimitedWidthContainer>
  )
}
