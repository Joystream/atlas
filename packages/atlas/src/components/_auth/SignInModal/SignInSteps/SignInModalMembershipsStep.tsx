import { FC, useCallback, useEffect, useState } from 'react'
import shallow from 'zustand/shallow'

import { Avatar } from '@/components/Avatar'
import { LogInErrors, useLogIn } from '@/hooks/useLogIn'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useJoystream } from '@/providers/joystream/joystream.hooks'
import { useSnackbar } from '@/providers/snackbars'
import { useUser } from '@/providers/user/user.hooks'
import { useUserStore } from '@/providers/user/user.store'
import { shortenString } from '@/utils/misc'

import { SignInModalStepTemplate } from './SignInModalStepTemplate'
import { ListItemsWrapper, StyledListItem } from './SignInSteps.styles'
import { ModalSteps, SignInStepProps } from './SignInSteps.types'

type SignInModalAccountStepProps = SignInStepProps

export const SignInModalMembershipsStep: FC<SignInModalAccountStepProps> = ({
  setPrimaryButtonProps,
  hasNavigatedBack,
  goToStep,
}) => {
  const smMatch = useMediaMatch('sm')
  const { setSignInModalOpen } = useUserStore(
    (state) => ({ setSignInModalOpen: state.actions.setSignInModalOpen }),
    shallow
  )
  const [localSelectedMembership, setLocalSelectedMembership] = useState<string | null>(null)
  const { memberships } = useUser()
  const { joystream } = useJoystream()
  const handleLogin = useLogIn()
  const { displaySnackbar } = useSnackbar()

  const {
    actions: { setActiveUser },
  } = useUserStore()

  const handleConfirm = useCallback(async () => {
    if (!joystream?.signMessage) return

    const member = memberships.find((entity) => entity.id === localSelectedMembership)

    if (!member) return

    goToStep(ModalSteps.Logging)
    const res = await handleLogin({
      type: 'extension',
      sign: (data) =>
        joystream.signMessage(
          {
            type: 'payload',
            data,
          },
          member.controllerAccount
        ),
      address: member.controllerAccount,
    })

    if (res.error === LogInErrors.NoAccountFound) {
      return goToStep(ModalSteps.Email)
    }

    if (res.error === LogInErrors.InvalidPayload) {
      displaySnackbar({
        iconType: 'error',
        title: 'There was a problem with signature. Please try again.',
      })
    }

    if (res.data) {
      setActiveUser({
        memberId: member.id,
        accountId: member.controllerAccount,
        channelId: member.channels[0].id,
      })
      setSignInModalOpen(false)
    }
  }, [
    displaySnackbar,
    goToStep,
    handleLogin,
    joystream,
    localSelectedMembership,
    memberships,
    setActiveUser,
    setSignInModalOpen,
  ])

  useEffect(() => {
    if (localSelectedMembership) return

    setLocalSelectedMembership(memberships[0].id)
  }, [localSelectedMembership, memberships])

  // send updates to SignInModal on state of primary button
  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Log in',
      disabled: !localSelectedMembership,
      onClick: handleConfirm,
    })
  }, [handleConfirm, localSelectedMembership, setPrimaryButtonProps])

  return (
    <SignInModalStepTemplate
      title="Select membership"
      subtitle="It looks like you have multiple memberships connected to this wallet. Select membership which you want to log in."
      hasNavigatedBack={hasNavigatedBack}
    >
      <ListItemsWrapper>
        {memberships.map(({ controllerAccount, metadata, handle, id }) => (
          <StyledListItem
            key={handle}
            label={handle ?? 'Account'}
            caption={shortenString(controllerAccount, 5)}
            size={smMatch ? 'large' : 'medium'}
            selected={localSelectedMembership === id}
            nodeStart={
              <Avatar
                size={40}
                assetUrl={metadata?.avatar?.__typename === 'AvatarUri' ? metadata.avatar.avatarUri ?? '' : ''}
              />
            }
            onClick={() => setLocalSelectedMembership(id)}
          />
        ))}
      </ListItemsWrapper>
    </SignInModalStepTemplate>
  )
}
