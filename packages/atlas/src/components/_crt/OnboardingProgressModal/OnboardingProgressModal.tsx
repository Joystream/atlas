import { useState } from 'react'

import { confettiAnimation } from '@/assets/animations'
import { AppKV } from '@/components/AppKV'
import { LottiePlayer } from '@/components/LottiePlayer'
import { Text } from '@/components/Text'
import {
  ContentWrapper,
  IllustrationWrapper,
  LottieContainer,
} from '@/components/_auth/SignUpModal/SignUpSteps/SignUpSuccessStep/SignUpSuccessStep.styles'
import { TextButton } from '@/components/_buttons/Button'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useMountEffect } from '@/hooks/useMountEffect'
import { useOverlayManager } from '@/providers/overlayManager'

const data = {
  master: {
    title: 'Congratulations on becoming a token master!',
    description:
      'Now you are ready to share your token with community and make profits from the market. \n' +
      '\n' +
      'One more step to go before token expert, which will grant you featuring on our marketplace and special privileges with the project in the future!',
  },
  expert: {
    title: 'Congratulations on becoming a token expert!',
    // todo export discord link to config
    description: (
      <>
        Congratulations on becoming a token expert! You have qualified for the token expert role and your token can be
        featured on the marketplace. Reach out in{' '}
        <TextButton to="https://discord.gg/abUwBfKT">Gleev Creator Discord</TextButton> to claim the token expert role
        and token featuring!
      </>
    ),
  },
}

export type OnboardingProgressModalProps = {
  type: keyof typeof data
  show: boolean
  onContinue: () => void
}

export const OnboardingProgressModal = ({ onContinue, type, show }: OnboardingProgressModalProps) => {
  const smMatch = useMediaMatch('sm')
  const { anyOverlaysOpen } = useOverlayManager()
  const [noOverlayOnRender, setNoOverlayOnRender] = useState(false)

  useMountEffect(() => {
    setNoOverlayOnRender(!anyOverlaysOpen)
  })

  return (
    <DialogModal
      show={show && noOverlayOnRender}
      confetti={show && noOverlayOnRender && smMatch}
      primaryButton={{
        text: 'Continue',
        onClick: () => onContinue(),
      }}
    >
      <IllustrationWrapper>
        <AppKV customNode={null} />
        {!smMatch && (
          <LottieContainer>
            <LottiePlayer
              size={{
                height: 320,
                width: 320,
              }}
              data={confettiAnimation}
            />
          </LottieContainer>
        )}
      </IllustrationWrapper>
      <ContentWrapper>
        <Text variant="h500" as="h2" margin={{ bottom: 2 }}>
          {data[type].title}
        </Text>
        <Text variant="t200" as="p" color="colorText">
          {data[type].description}
        </Text>
      </ContentWrapper>
    </DialogModal>
  )
}
