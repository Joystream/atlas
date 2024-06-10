import { FC } from 'react'

import confettiAnimation from '@/assets/animations/confetti.json'
import { AppKV } from '@/components/AppKV'
import { LottiePlayer } from '@/components/LottiePlayer'
import { Text } from '@/components/Text'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useMountEffect } from '@/hooks/useMountEffect'

import { CommonProps } from './types'

import {
  ContentWrapper,
  IllustrationWrapper,
  LottieContainer,
} from '../../OnboardingProgressModal/OnboardingProgressModal'

type SignUpSuccessStepProps = {
  tokenName?: string
  coinImageUrl?: string
  onClose: () => void
} & CommonProps

export const BuySaleTokenSuccess: FC<SignUpSuccessStepProps> = ({ tokenName, setPrimaryButtonProps, onClose }) => {
  const smMatch = useMediaMatch('sm')

  useMountEffect(() => {
    setPrimaryButtonProps({
      text: 'Continue',
      onClick: () => onClose(),
    })
  })
  return (
    <>
      <IllustrationWrapper>
        <AppKV />
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
          Congratulations on your purchase
        </Text>
        <Text variant="t200" as="p" color="colorText">
          You are now an {tokenName} holder - you can buy, sell, transfer your token. You can also stake when creator
          opens revenue share to claim your part of the channel's revenue.
        </Text>
      </ContentWrapper>
    </>
  )
}
