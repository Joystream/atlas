import { useState } from 'react'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Tabs } from '@/components/Tabs'
import { Text } from '@/components/Text'
import { PayoutsWelcomeDialogContent } from '@/components/_overlays/PayoutsWelcomeDialogContent'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMountEffect } from '@/hooks/useMountEffect'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { usePersonalDataStore } from '@/providers/personalData'

import { TabsContainer } from './MyPayments.styles'
import { PaymentsOverViewTab } from './PaymentsOverviewTab'

const PAYOUTS_WELCOME_MESSAGE = 'payouts-welcome'

const TABS = ['Overview', 'Transactions'] as const

export const MyPaymentsView = () => {
  const headTags = useHeadTags('My payments')
  const mappedTabs = TABS.map((tab) => ({ name: tab }))
  const [selectedTab, setSelectedTab] = useState<typeof TABS[number]>('Overview')
  // const { channelId } = useUser()
  // const { channel } = useFullChannel(channelId ?? '')
  // const { paymentData } = useChannelPaymentsHistory(channel)

  const isDismissedMessage = usePersonalDataStore((state) =>
    state.dismissedMessages.some((message) => message.id === PAYOUTS_WELCOME_MESSAGE)
  )
  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)
  const [openPayoutsWelcomeModal, closePayoutsWelcomeModal] = useConfirmationModal({
    noIcon: true,
    children: <PayoutsWelcomeDialogContent />,
    primaryButton: {
      text: 'Continue',
      onClick: () => {
        updateDismissedMessages(PAYOUTS_WELCOME_MESSAGE)
        closePayoutsWelcomeModal()
      },
    },
  })

  useMountEffect(() => {
    if (!isDismissedMessage) {
      openPayoutsWelcomeModal()
    }
  })

  return (
    <LimitedWidthContainer>
      {headTags}
      <Text as="h1" variant="h700" margin={{ top: 12, bottom: 12 }}>
        My payments
      </Text>
      <TabsContainer>
        <Tabs initialIndex={0} tabs={mappedTabs} onSelectTab={(tabIdx) => setSelectedTab(TABS[tabIdx])} />
      </TabsContainer>
      {selectedTab === 'Overview' && <PaymentsOverViewTab />}
      {/* Todo add table here */}
      {selectedTab === 'Transactions' && null}
      {/*<TablePaymentsHistory data={paymentData} />*/}
    </LimitedWidthContainer>
  )
}
