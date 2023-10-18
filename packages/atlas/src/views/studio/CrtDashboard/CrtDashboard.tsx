import { useCallback, useState } from 'react'

import { useGetFullCreatorTokenQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { SvgActionEdit, SvgActionLinkUrl, SvgActionRevenueShare } from '@/assets/icons'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Tabs } from '@/components/Tabs'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { CloseRevenueShareButton } from '@/components/_crt/CloseRevenueShareButton'
import { StartRevenueShare } from '@/components/_crt/StartRevenueShareModal/StartRevenueShareModal'
import { StartSaleOrMarketButton } from '@/components/_crt/StartSaleOrMarketButton/StartSaleOrMarketButton'
import { useUser } from '@/providers/user/user.hooks'
import { HeaderContainer, MainContainer, TabsContainer } from '@/views/studio/CrtDashboard/CrtDashboard.styles'
import { CrtDashboardMainTab } from '@/views/studio/CrtDashboard/tabs/CrtDashboardMainTab'
import { CrtHoldersTab } from '@/views/studio/CrtDashboard/tabs/CrtHoldersTab'
import { CrtRevenueTab } from '@/views/studio/CrtDashboard/tabs/CrtRevenueTab'

const TABS = ['Dashboard', 'Holders', 'Revenue share', 'Settings'] as const

export const CrtDashboard = () => {
  const [currentTab, setCurrentTab] = useState<number>(0)
  const [openRevenueShareModal, setOpenRevenueShareModal] = useState(false)
  const { activeChannel } = useUser()
  const { data } = useGetFullCreatorTokenQuery({
    variables: {
      id: activeChannel?.creatorToken?.token.id ?? '',
    },
  })
  const handleChangeTab = useCallback((idx: number) => {
    setCurrentTab(idx)
  }, [])

  const mappedTabs = TABS.map((tab) => ({ name: tab }))

  if (!data?.creatorTokenById) {
    return null
  }

  const activeRevenueShare = data.creatorTokenById.revenueShares.find((revenueShare) => !revenueShare.finalized)

  return (
    <LimitedWidthContainer>
      <StartRevenueShare show={openRevenueShareModal} tokenId="1" onClose={() => setOpenRevenueShareModal(false)} />
      <MainContainer>
        <HeaderContainer>
          <Text variant="h700" as="h1">
            ${data.creatorTokenById.symbol ?? 'N/A'}
          </Text>
          <Button variant="tertiary" icon={<SvgActionLinkUrl />} iconPlacement="right">
            See your token
          </Button>
        </HeaderContainer>

        <TabsContainer>
          <Tabs initialIndex={0} selected={currentTab} tabs={mappedTabs} onSelectTab={handleChangeTab} />
          {currentTab === 0 && (
            <>
              <Button variant="secondary" icon={<SvgActionEdit />}>
                Edit token page
              </Button>
              <StartSaleOrMarketButton tokenName={data.creatorTokenById.symbol ?? 'N/A'} />
            </>
          )}
          {currentTab === 2 && (
            <>
              {!activeRevenueShare ? (
                <Button onClick={() => setOpenRevenueShareModal(true)} icon={<SvgActionRevenueShare />}>
                  Start revenue share
                </Button>
              ) : (
                <CloseRevenueShareButton revenueShare={activeRevenueShare} />
              )}
            </>
          )}
        </TabsContainer>
        {currentTab === 0 && <CrtDashboardMainTab token={data.creatorTokenById} />}
        {currentTab === 1 && <CrtHoldersTab token={data.creatorTokenById} />}
        {currentTab === 2 && <CrtRevenueTab token={data.creatorTokenById} />}
      </MainContainer>
    </LimitedWidthContainer>
  )
}
