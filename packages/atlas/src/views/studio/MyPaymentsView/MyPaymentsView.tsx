import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Text } from '@/components/Text'
import { PayoutsWelcomeDialogContent } from '@/components/_overlays/PayoutsWelcomeDialogContent'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMountEffect } from '@/hooks/useMountEffect'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { usePersonalDataStore } from '@/providers/personalData'

import { PaymentsOverView } from './PaymentsOverview'
import { PaymentTransactions } from './PaymentsTransactions'

const PAYOUTS_WELCOME_MESSAGE = 'payouts-welcome'

const MyPaymentsView = () => {
  const headTags = useHeadTags('My payments')
  const isDismissedMessage = usePersonalDataStore((state) =>
    state.dismissedMessages.some((message) => message.id === PAYOUTS_WELCOME_MESSAGE)
  )
  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)
  const [openPayoutsWelcomeModal, closePayoutsWelcomeModal] = useConfirmationModal()

  useMountEffect(() => {
    if (!isDismissedMessage) {
      openPayoutsWelcomeModal({
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
    }
  })

  return (
    <LimitedWidthContainer>
      {headTags}
      <Text as="h1" variant="h700" margin={{ top: 12, bottom: 12 }}>
        My payments
      </Text>
      <PaymentsOverView />
      <PaymentTransactions />
    </LimitedWidthContainer>
  )
}

export default MyPaymentsView
