import { useCallback, useState } from 'react'

import { SvgActionEdit, SvgActionLinkUrl, SvgActionSell } from '@/assets/icons'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Tabs } from '@/components/Tabs'
import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { atlasConfig } from '@/config'
import { useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { HeaderContainer, MainContainer, TabsContainer } from '@/views/studio/CrtDashboard/CrtDashboard.styles'
import { CrtDashboardMainTab } from '@/views/studio/CrtDashboard/tabs/CrtDashboardMainTab'
import { CrtHoldersTab } from '@/views/studio/CrtDashboard/tabs/CrtHoldersTab'
import { CrtRevenueTab } from '@/views/studio/CrtDashboard/tabs/CrtRevenueTab'

const TABS = ['Dashboard', 'Holders', 'Revenue share', 'Settings'] as const

export const CrtDashboard = () => {
  const [currentTab, setCurrentTab] = useState<number>(0)
  const { joystream, proxyCallback } = useJoystream()
  const { channelId, memberId } = useUser()
  const { displaySnackbar } = useSnackbar()
  const handleTransaction = useTransaction()
  const handleChangeTab = useCallback((idx: number) => {
    setCurrentTab(idx)
  }, [])

  const mappedTabs = TABS.map((tab) => ({ name: tab }))

  const finalizeRevenueShare = useCallback(() => {
    if (!joystream || !memberId || !channelId) {
      return
    }
    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).finalizeRevenueSplit(memberId, channelId, proxyCallback(updateStatus)),
      onTxSync: async (data) => {
        displaySnackbar({
          title: 'Revenue share is closed',
          description: `Remaining unclaimed ${data.amount} ${atlasConfig.joystream.tokenTicker} was transfered back to your channel balance`,
          iconType: 'info',
        })
      },
    })
  }, [channelId, displaySnackbar, handleTransaction, joystream, memberId])

  return (
    <LimitedWidthContainer>
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
            <Button variant="secondary" icon={<SvgActionEdit />}>
              Edit token page
            </Button>
          )}
          {currentTab === 2 && <Button onClick={finalizeRevenueShare}>Close revenue share</Button>}
          <Button icon={<SvgActionSell />}>Start sale or market</Button>
        </TabsContainer>
        {currentTab === 0 && <CrtDashboardMainTab />}
        {currentTab === 1 && <CrtHoldersTab />}
        {currentTab === 2 && <CrtRevenueTab />}
      </MainContainer>
    </LimitedWidthContainer>
  )
}
