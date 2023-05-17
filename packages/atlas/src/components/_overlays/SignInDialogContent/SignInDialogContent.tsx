import { FC } from 'react'

import { AppKV } from '@/components/AppKV'
import { Text } from '@/components/Text'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import { IllustrationWrapper, SignInDialogTextWrapper } from './SignInDialogContent.styles'

type SignInDialogContentProps = {
  isMobileDevice: boolean
  interaction?: boolean
}

export const SignInDialogContent: FC<SignInDialogContentProps> = ({ isMobileDevice, interaction }) => {
  const smMatch = useMediaMatch('sm')
  return (
    <>
      <IllustrationWrapper isMobileDevice={isMobileDevice}>
        <AppKV />
      </IllustrationWrapper>
      <SignInDialogTextWrapper>
        <Text as="h1" variant={smMatch ? 'h500' : 'h400'}>
          {isMobileDevice ? `${atlasConfig.general.appName} is best experienced on desktop` : 'Log in to continue'}
        </Text>
        {!isMobileDevice ? (
          <Text as="p" variant="t200" color="colorText">
            Connect your wallet and sign in to a free Joystream membership to continue.
          </Text>
        ) : (
          <>
            <Text as="p" variant="t200" color="colorText">
              {interaction
                ? "To continue, you'll need to connect a wallet and set up a free Joystream membership, which is best done on a desktop."
                : `While we work on a full mobile experience, we encourage you to visit ${atlasConfig.general.appName} on your desktop to create a free Joystream membership today.`}
            </Text>
            <Text as="p" variant="t200" color="colorText">
              If you have a wallet app on your phone, tap “Connect anyway” to create your membership.
            </Text>
          </>
        )}
      </SignInDialogTextWrapper>
    </>
  )
}
