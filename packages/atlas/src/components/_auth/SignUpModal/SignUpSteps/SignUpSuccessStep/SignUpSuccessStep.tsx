import confettiAnimation from '@/assets/animations/confetti.json'
import { AppKV } from '@/components/AppKV'
import { Avatar } from '@/components/Avatar'
import { LottiePlayer } from '@/components/LottiePlayer'
import { Text } from '@/components/Text'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { ContentWrapper, IllustrationWrapper, LottieContainer } from './SignUpSuccessStep.styles'

export const SignUpSuccessStep = () => {
  const smMatch = useMediaMatch('sm')
  return (
    <>
      <IllustrationWrapper>
        <AppKV customNode={<Avatar size={136} assetUrl="https://placedog.net/500" />} />
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
          Your membership has been created!
        </Text>
        <Text variant="t200" as="p" color="colorText">
          Congratulations! Now you can browse, watch, create, collect videos across the platform and have fun!
          <br />
          <br />
          Enjoy your X JOY tokens to help you cover transaction fees. These tokens are non-transferable and can't be
          spent on NFTs or other purchases.
        </Text>
      </ContentWrapper>
    </>
  )
}
