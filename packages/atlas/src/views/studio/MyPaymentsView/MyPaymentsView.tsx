import { Text } from '@/components/Text'
import { PayoutsWelcomeDialogContent } from '@/components/_overlays/PayoutsWelcomeDialogContent'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useMountEffect } from '@/hooks/useMountEffect'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { usePersonalDataStore } from '@/providers/personalData'

import { BottomPattern, StyledSvgSmallTokens, TextContainer, TopPattern, Wrapper } from './MyPayments.styles'

const PAYOUTS_WELCOME_MESSAGE = 'payouts-welcome'

export const MyPaymentsView = () => {
  const headTags = useHeadTags('My payments')
  const smMatch = useMediaMatch('sm')
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
    <Wrapper>
      <BottomPattern />
      <TopPattern />
      {headTags}
      <StyledSvgSmallTokens />
      <TextContainer>
        <Text variant={smMatch ? 'h600' : 'h500'} as="h1" margin={{ bottom: 4, top: 8 }}>
          My Payments are coming {!smMatch && <br />} later this year
        </Text>
        <Text variant="t300" as="p" color="colorText">
          My Payments will give you an overview of incomes and outcomes of your channel balance, let you claim rewards
          from the council, and withdraw tokens to your personal Joystream membership.
        </Text>
      </TextContainer>
    </Wrapper>
  )
}
