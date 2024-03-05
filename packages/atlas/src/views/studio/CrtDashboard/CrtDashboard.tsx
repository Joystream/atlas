import { useCallback, useState } from 'react'

import { SvgActionEdit, SvgActionLinkUrl, SvgActionRevenueShare, SvgActionSell } from '@/assets/icons'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Tabs } from '@/components/Tabs'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { StartRevenueShare } from '@/components/_crt/StartRevenueShareModal/StartRevenueShareModal'
import { HeaderContainer, MainContainer, TabsContainer } from '@/views/studio/CrtDashboard/CrtDashboard.styles'
import { CrtDashboardMainTab } from '@/views/studio/CrtDashboard/tabs/CrtDashboardMainTab'
import { CrtHoldersTab } from '@/views/studio/CrtDashboard/tabs/CrtHoldersTab'
import { CrtRevenueTab } from '@/views/studio/CrtDashboard/tabs/CrtRevenueTab'

const TABS = ['Dashboard', 'Holders', 'Revenue share', 'Settings'] as const

export const CrtDashboard = () => {
  const [currentTab, setCurrentTab] = useState<number>(0)
  const [openRevenueShareModal, setOpenRevenueShareModal] = useState(false)
  const handleChangeTab = useCallback((idx: number) => {
    setCurrentTab(idx)
  }, [])

  const mappedTabs = TABS.map((tab) => ({ name: tab }))

  return (
    <LimitedWidthContainer>
      <StartRevenueShare show={openRevenueShareModal} tokenId="1" onClose={() => setOpenRevenueShareModal(false)} />
      <MainContainer>
        <HeaderContainer>
          <Text variant="h700" as="h1">
            $JBC
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
              <Button icon={<SvgActionSell />}>Start sale or market</Button>
            </>
          )}
          {currentTab === 2 && (
            <Button onClick={() => setOpenRevenueShareModal(true)} icon={<SvgActionRevenueShare />}>
              Start revenue share
            </Button>
          )}
        </TabsContainer>
        {currentTab === 0 && <CrtDashboardMainTab />}
        {currentTab === 1 && <CrtHoldersTab />}
        {currentTab === 2 && <CrtRevenueTab />}
      </MainContainer>
    </LimitedWidthContainer>
  )
}
