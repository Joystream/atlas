import styled from '@emotion/styled'
import { FC } from 'react'
import { useNavigate } from 'react-router'

import confettiAnimation from '@/assets/animations/confetti.json'
import { AppKV } from '@/components/AppKV'
import { LottiePlayer } from '@/components/LottiePlayer'
import { Text } from '@/components/Text'
import {
  ContentWrapper,
  IllustrationWrapper,
  LottieContainer,
} from '@/components/_auth/SignUpModal/SignUpSteps/SignUpSuccessStep/SignUpSuccessStep.styles'
import { AnimatedCoin } from '@/components/_crt/AnimatedCoin/AnimatedCoin'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useMountEffect } from '@/hooks/useMountEffect'
import { useSnackbar } from '@/providers/snackbars'

import { CommonProps } from './types'

type SignUpSuccessStepProps = {
  tokenName?: string
  tokenAmount?: number
  coinImageUrl?: string
  onClose: () => void
} & CommonProps

export const BuyMarketTokenSuccess: FC<SignUpSuccessStepProps> = ({
  tokenName,
  setPrimaryButtonProps,
  onClose,
  tokenAmount,
}) => {
  const smMatch = useMediaMatch('sm')
  const { displaySnackbar } = useSnackbar()
  const navigate = useNavigate()

  useMountEffect(() => {
    setPrimaryButtonProps({
      text: 'Continue',
      onClick: () => {
        onClose()
        displaySnackbar({
          iconType: 'success',
          title: `${tokenAmount} $${tokenName} purchased`,
          description: 'You will find it in your portfolio.',
          actionText: 'Go to portfolio',
          onActionClick: () => navigate(absoluteRoutes.viewer.portfolio()),
        })
      },
    })
  })
  return (
    <>
      <IllustrationWrapper>
        <AppKV customNode={<StyledAnimatedCoin />} />
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
          You are now an ${tokenName} holder - you can buy, sell, transfer your token. You can also stake when creator
          opens revenue share to claim your part of it.
        </Text>
      </ContentWrapper>
    </>
  )
}

const StyledAnimatedCoin = styled(AnimatedCoin)`
  position: absolute;
`
