import { FC, useCallback, useEffect, useState } from 'react'

import { Avatar } from '@/components/Avatar'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useUser } from '@/providers/user/user.hooks'
import { useUserStore } from '@/providers/user/user.store'
import { shortenString } from '@/utils/misc'

import { SignInModalStepTemplate } from './SignInModalStepTemplate'
import { ListItemsWrapper, StyledListItem } from './SignInSteps.styles'
import { SignInStepProps } from './SignInSteps.types'

type SignInModalAccountStepProps = SignInStepProps & {
  onConfirm: (address: string) => void
}

export const SignInModalMembershipsStep: FC<SignInModalAccountStepProps> = ({
  setPrimaryButtonProps,
  hasNavigatedBack,
  onConfirm,
}) => {
  const smMatch = useMediaMatch('sm')
  const [localSelectedMembership, setLocalSelectedMembership] = useState<string | null>(null)
  const { memberships } = useUser()
  const {
    actions: { setActiveUser },
  } = useUserStore()

  const handleConfirm = useCallback(() => {
    const member = memberships.find((entity) => entity.id === localSelectedMembership)

    if (!localSelectedMembership || !member) return

    setActiveUser({
      memberId: member.id,
      accountId: member.controllerAccount,
      channelId: member.channels[0].id,
    })
    onConfirm(member.controllerAccount)
  }, [localSelectedMembership, memberships, onConfirm, setActiveUser])

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
