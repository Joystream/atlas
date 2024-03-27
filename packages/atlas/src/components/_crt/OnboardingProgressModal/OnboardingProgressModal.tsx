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
    description:
      'Now when you know everything about managing your token you close “your progress” section and keep managing token on your own.',
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
