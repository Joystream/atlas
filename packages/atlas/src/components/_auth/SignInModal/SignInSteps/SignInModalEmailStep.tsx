import { FC, useCallback, useEffect } from 'react'

import { SignInModalStepTemplate } from './SignInModalStepTemplate'
import { SignInStepProps } from './SignInSteps.types'

type SignInModalEmailStepProps = SignInStepProps & {
  onConfirm?: (address: string) => void
}

export const SignInModalEmailStep: FC<SignInModalEmailStepProps> = ({ setPrimaryButtonProps, onConfirm }) => {
  const handleConfirm = useCallback(() => {}, [])

  // send updates to SignInModal on state of primary button
  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Continue',
      onClick: handleConfirm,
    })
  }, [handleConfirm, setPrimaryButtonProps])

  return (
    <SignInModalStepTemplate
      title="Add your email"
      subtitle="Get notified about important events and stay updated. You can change all notifications permissions in your profile settings."
      hasNavigatedBack={false}
    />
  )
}
