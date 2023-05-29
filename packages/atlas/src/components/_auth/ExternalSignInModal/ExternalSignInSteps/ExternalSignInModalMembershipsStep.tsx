import { FC, useCallback, useEffect } from 'react'
import shallow from 'zustand/shallow'

import { Avatar } from '@/components/Avatar'
import { LogInErrors, useLogIn } from '@/hooks/useLogIn'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { useJoystream } from '@/providers/joystream/joystream.hooks'
import { useSnackbar } from '@/providers/snackbars'
import { useUser } from '@/providers/user/user.hooks'
import { useUserStore } from '@/providers/user/user.store'
import { shortenString } from '@/utils/misc'

import { ExternalSignInModalStepTemplate } from './ExternalSignInModalStepTemplate'
import { ListItemsWrapper, StyledListItem } from './ExternalSignInSteps.styles'
import { ModalSteps, SignInStepProps } from './ExternalSignInSteps.types'

type SignInModalAccountStepProps = SignInStepProps & {
  memberId: string | null
  setMemberId: (id: string) => void
}

export const ExternalSignInModalMembershipsStep: FC<SignInModalAccountStepProps> = ({
  setPrimaryButtonProps,
  hasNavigatedBack,
  goToStep,
  setMemberId,
  memberId,
}) => {
  const smMatch = useMediaMatch('sm')
  const { setSignInModalOpen, setActiveUser } = useUserStore(
    (state) => ({ setSignInModalOpen: state.actions.setSignInModalOpen, setActiveUser: state.actions.setActiveUser }),
    shallow
  )
  const { memberships } = useUser()
  const { joystream } = useJoystream()
  const handleLogin = useLogIn()
  const { displaySnackbar } = useSnackbar()

  const handleConfirm = useCallback(async () => {
    if (!joystream?.signMessage) return

    const member = memberships.find((entity) => entity.id === memberId)

    if (!member) return

    setActiveUser({
      memberId: member.id,
      accountId: member.controllerAccount,
      channelId: member.channels[0]?.id,
    })

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
      setSignInModalOpen(false)
    }
  }, [displaySnackbar, goToStep, handleLogin, joystream, memberId, memberships, setActiveUser, setSignInModalOpen])

  useEffect(() => {
    if (memberId) return

    setMemberId(memberships[0]?.id)
  }, [memberId, memberships, setMemberId])

  // send updates to SignInModal on state of primary button
  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Log in',
      disabled: !memberId,
      onClick: handleConfirm,
    })
  }, [handleConfirm, memberId, setPrimaryButtonProps])

  return (
    <ExternalSignInModalStepTemplate
      title="Select membership"
      subtitle="It looks like you have multiple memberships connected to this wallet. Select membership which you want to log in."
      hasNavigatedBack={hasNavigatedBack}
    >
      <ListItemsWrapper>
        {memberships.map((member) => (
          <StyledListItem
            key={member.id}
            label={member.handle ?? 'Account'}
            caption={shortenString(member.controllerAccount, 5)}
            size={smMatch ? 'large' : 'medium'}
            selected={memberId === member.id}
            nodeStart={<Avatar size={40} assetUrl={getMemberAvatar(member).url} />}
            onClick={() => setMemberId(member.id)}
          />
        ))}
      </ListItemsWrapper>
    </ExternalSignInModalStepTemplate>
  )
}
