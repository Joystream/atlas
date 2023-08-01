import { FC, useCallback, useEffect } from 'react'
import shallow from 'zustand/shallow'

import { GetMembershipsQuery } from '@/api/queries/__generated__/memberships.generated'
import { Avatar } from '@/components/Avatar'
import { AuthenticationModalStepTemplate } from '@/components/_auth/AuthenticationModalStepTemplate'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { useAuth } from '@/providers/auth/auth.hooks'
import { useAuthStore } from '@/providers/auth/auth.store'
import { LogInErrors } from '@/providers/auth/auth.types'
import { useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { SentryLogger } from '@/utils/logs'
import { shortenString } from '@/utils/misc'

import { ListItemsWrapper, StyledListItem } from './ExternalSignInSteps.styles'
import { ModalSteps, SignInStepProps } from './ExternalSignInSteps.types'

type SignInModalAccountStepProps = SignInStepProps & {
  memberId: string | null
  setMemberId: (id: string) => void
  memberships: GetMembershipsQuery['memberships'] | null
}

export const ExternalSignInModalMembershipsStep: FC<SignInModalAccountStepProps> = ({
  setPrimaryButtonProps,
  hasNavigatedBack,
  goToStep,
  setMemberId,
  memberId,
  memberships,
}) => {
  const smMatch = useMediaMatch('sm')
  const { setAuthModalOpenName } = useAuthStore(
    (state) => ({ setAuthModalOpenName: state.actions.setAuthModalOpenName }),
    shallow
  )
  const { setApiActiveAccount } = useJoystream()

  const { joystream } = useJoystream()
  const { handleLogin } = useAuth()
  const { displaySnackbar } = useSnackbar()

  const handleConfirm = useCallback(async () => {
    if (!joystream?.signMessage) return

    const member = memberships?.find((entity) => entity.id === memberId)

    if (!member) return

    await setApiActiveAccount('address', member.controllerAccount)

    goToStep(ModalSteps.ExtensionSigning)
    await handleLogin({
      type: 'external',
      sign: (data) =>
        joystream.signMessage({
          type: 'payload',
          data,
        }),
      address: member.controllerAccount,
    })
      .then(() => {
        setAuthModalOpenName(undefined)
      })
      .catch((error) => {
        if (error.message === LogInErrors.NoAccountFound) {
          return goToStep(ModalSteps.Email)
        }
        if (error.message === LogInErrors.InvalidPayload) {
          displaySnackbar({
            iconType: 'error',
            title: 'There was a problem with signature. Please try again.',
          })
          goToStep(ModalSteps.Membership)
          return
        }
        if (error.message === LogInErrors.SignatureCancelled) {
          displaySnackbar({
            iconType: 'warning',
            title: 'Message signing cancelled',
          })
          goToStep(ModalSteps.Membership)
          return
        }
        goToStep(ModalSteps.Membership)
        SentryLogger.error(
          'Unknown error when logging with external wallet',
          'ExternalSignInModalMembershipsStep',
          error
        )
      })
  }, [
    displaySnackbar,
    goToStep,
    handleLogin,
    joystream,
    memberId,
    memberships,
    setApiActiveAccount,
    setAuthModalOpenName,
  ])

  useEffect(() => {
    if (memberId) return

    setMemberId(memberships?.[0]?.id ?? '')
  }, [memberId, memberships, setMemberId])

  // send updates to SignInModal on state of primary button
  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Sign in',
      disabled: !memberId,
      onClick: handleConfirm,
    })
  }, [handleConfirm, memberId, setPrimaryButtonProps])

  return (
    <AuthenticationModalStepTemplate
      title="Select membership"
      subtitle="It looks like you have multiple memberships connected to this wallet. Select membership which you want to sign in."
      hasNavigatedBack={hasNavigatedBack}
    >
      <ListItemsWrapper>
        {memberships?.map((member) => (
          <StyledListItem
            key={member.id}
            label={member.handle ?? 'Account'}
            caption={shortenString(member.controllerAccount, 5)}
            size={smMatch ? 'large' : 'medium'}
            selected={memberId === member.id}
            nodeStart={<Avatar size={40} assetUrls={getMemberAvatar(member).urls} />}
            onClick={() => setMemberId(member.id)}
          />
        ))}
      </ListItemsWrapper>
    </AuthenticationModalStepTemplate>
  )
}
