import { FC } from 'react'

import { confettiAnimation } from '@/assets/animations'
import { AppKV } from '@/components/AppKV'
import { Avatar } from '@/components/Avatar'
import { LottiePlayer } from '@/components/LottiePlayer'
import { Text } from '@/components/Text'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { formatNumber } from '@/utils/number'

import { ContentWrapper, IllustrationWrapper, LottieContainer } from './SignUpSuccessStep.styles'

type SignUpSuccessStepProps = {
  avatarUrl?: string
  amountOfTokens?: number
}

export const SignUpSuccessStep: FC<SignUpSuccessStepProps> = ({ avatarUrl, amountOfTokens }) => {
  const smMatch = useMediaMatch('sm')
  return (
    <>
      <IllustrationWrapper>
        <AppKV customNode={<Avatar size={136} assetUrls={avatarUrl ? [avatarUrl] : []} />} />
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
          {amountOfTokens && amountOfTokens > 0 && (
            <>
              <br />
              <br />
              Enjoy your {formatNumber(amountOfTokens)} {atlasConfig.joystream.tokenTicker} tokens to help you cover
              transaction fees. These tokens are non-transferable and can't be spent on NFTs or other purchases.
            </>
          )}
        </Text>
      </ContentWrapper>
    </>
  )
}
