import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

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
import { Loader } from '@/components/_loaders/Loader'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { useMountEffect } from '@/hooks/useMountEffect'
import { useUser } from '@/providers/user/user.hooks'
import { SentryLogger } from '@/utils/logs'
import {
  EmptyStateBox,
  HeaderContainer,
  MainContainer,
  TabsContainer,
} from '@/views/studio/CrtDashboard/CrtDashboard.styles'
import { CrtDashboardMainTab } from '@/views/studio/CrtDashboard/tabs/CrtDashboardMainTab'
import { CrtHoldersTab } from '@/views/studio/CrtDashboard/tabs/CrtHoldersTab'
import { CrtMarketTab } from '@/views/studio/CrtDashboard/tabs/CrtMarketTab'
import { CrtRevenueTab } from '@/views/studio/CrtDashboard/tabs/CrtRevenueTab'

import { TABS } from './CrtDashboard.types'

type TabsNames = typeof TABS[number]

const getTabIndex = (tabName: TabsNames, allTabs: { name: TabsNames }[]): number =>
  allTabs.findIndex((tab) => tab.name === tabName)

export const CrtDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTabName = searchParams.get('tab') as typeof TABS[number] | null
  const { activeChannel } = useUser()
  const { data } = useGetFullCreatorTokenQuery({
    variables: {
      id: activeChannel?.creatorToken?.token.id ?? '',
    },
    onError: (error) => {
      SentryLogger.error('Failed to fetch creator token', 'CrtDashboard', error)
    },
  })

  const hasOpenMarket = data?.creatorTokenById?.ammCurves.some((curve) => !curve.finalized)
  const mappedTabs = TABS.filter((tab) => (hasOpenMarket ? true : tab !== 'Market')).map((tab) => ({ name: tab }))
  const currentTab = currentTabName ? getTabIndex(currentTabName, mappedTabs) : 0
  const handleChangeTab = useCallback(
    (idx: number) => {
      setSearchParams({ tab: mappedTabs[idx].name })
    },
    [mappedTabs, setSearchParams]
  )
  useMountEffect(() => {
    if (currentTab === -1) setSearchParams({ 'tab': '0' }, { replace: true })
  })

  const activeRevenueShare = data?.creatorTokenById?.revenueShares.find((revenueShare) => !revenueShare.finalized)
  const { creatorTokenById } = data ?? {}

  return (
    <LimitedWidthContainer big>
      <MainContainer>
        <HeaderContainer>
          <Text variant="h700" as="h1">
            {creatorTokenById ? `${creatorTokenById.symbol ?? 'N/A'}` : <SkeletonLoader height={50} width={120} />}
          </Text>
          {creatorTokenById ? (
            <Button
              to={absoluteRoutes.viewer.channel(creatorTokenById.channel?.channel.id, { tab: 'Token' })}
              variant="tertiary"
              icon={<SvgActionLinkUrl />}
              iconPlacement="right"
            >
              See your token
            </Button>
          ) : null}
        </HeaderContainer>

        <TabsContainer>
          <Tabs initialIndex={0} selected={currentTab ?? 0} tabs={mappedTabs} onSelectTab={handleChangeTab} />
          {creatorTokenById ? (
            <>
              {currentTab === getTabIndex('Dashboard', mappedTabs) && (
                <>
                  <Button to={absoluteRoutes.studio.crtTokenEdit()} variant="secondary" icon={<SvgActionEdit />}>
                    Edit token page
                  </Button>
                  {!hasOpenMarket ? (
                    <StartSaleOrMarketButton tokenId={creatorTokenById.id ?? 'N/A'} />
                  ) : (
                    <CloseMarketButton
                      channelId={activeChannel?.id ?? '-1'}
                      tokenId={data?.creatorTokenById?.id ?? ''}
                    />
                  )}
                </>
              )}
              {currentTab === getTabIndex('Market', mappedTabs) && (
                <CloseMarketButton channelId={activeChannel?.id ?? '-1'} tokenId={data?.creatorTokenById?.id ?? ''} />
              )}
              {currentTab === getTabIndex('Revenue share', mappedTabs) && (
                <>
                  {!activeRevenueShare ? (
                    <RevenueShareModalButton token={creatorTokenById} />
                  ) : (
                    <CloseRevenueShareButton
                      hideOnInactiveRevenue
                      revenueShareEndingBlock={activeRevenueShare.endsAt}
                    />
                  )}
                </>
              )}
            </>
          ) : (
            <SkeletonLoader height={40} width={100} />
          )}
        </TabsContainer>
        {creatorTokenById ? (
          <>
            {currentTab === getTabIndex('Dashboard', mappedTabs) && (
              <CrtDashboardMainTab
                hasOpenedMarket={!!hasOpenMarket}
                token={creatorTokenById}
                onTabChange={(tabName) => handleChangeTab(mappedTabs.findIndex((tab) => tab.name === tabName))}
              />
            )}
            {currentTab === getTabIndex('Market', mappedTabs) && <CrtMarketTab token={creatorTokenById} />}
            {currentTab === getTabIndex('Holders', mappedTabs) && <CrtHoldersTab token={creatorTokenById} />}
            {currentTab === getTabIndex('Revenue share', mappedTabs) && <CrtRevenueTab token={creatorTokenById} />}
          </>
        ) : (
          <EmptyStateBox>
            <Loader variant="xlarge" />
          </EmptyStateBox>
        )}
      </MainContainer>
    </LimitedWidthContainer>
  )
}
