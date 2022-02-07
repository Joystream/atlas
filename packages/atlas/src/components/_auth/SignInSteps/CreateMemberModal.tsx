import axios, { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { useQueryNodeStateSubscription } from '@/api/hooks'
import { Text } from '@/components/Text'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { Loader } from '@/components/_loaders/Loader'
import { absoluteRoutes } from '@/config/routes'
import { FAUCET_URL } from '@/config/urls'
import { useCreateEditMemberForm } from '@/hooks/useCreateEditMember'
import { MemberId } from '@/joystream-lib'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useConnectionStatusStore } from '@/providers/connectionStatus'
import { useSnackbar } from '@/providers/snackbars'
import { useUser } from '@/providers/user'
import { SentryLogger } from '@/utils/logs'

import { StyledAvatar, StyledButton, StyledDialogModal, Wrapper } from './CreateMemberModal.styles'

import { CreateEditMemberInputs } from '../CreateEditMemberInputs'

type Inputs = {
  handle: string | null
  avatar: string | null
  about: string | null
}

type CreateMemberModalProps = {
  show: boolean
}

export const CreateMemberModal: React.FC<CreateMemberModalProps> = ({ show }) => {
  const { activeAccountId, refetchMemberships, extensionConnected, setActiveUser } = useUser()
  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [membershipBlock, setMembershipBlock] = useState<number | null>(null)
  const [openCreatingMemberDialog, closeCreatingMemberDialog] = useConfirmationModal({
    headerIcon: <Loader variant="medium" />,
    title: 'Creating membership...',
    description:
      "Please wait while your membership is being created. Our faucet server will create it for you so you don't need to worry about any fees. This should take about 15 seconds.",
  })
  const [isCreatingMembership, setIsCreatingMembership] = useState(false)
  const [openErrorDialog, closeErrorDialog] = useConfirmationModal()
  const { displaySnackbar } = useSnackbar()

  const { queryNodeState, error: queryNodeStateError } = useQueryNodeStateSubscription({ skip: !membershipBlock })
  // subscription doesn't allow 'onError' callback
  useEffect(() => {
    if (!queryNodeStateError) return
    SentryLogger.error('Failed to subscribe to query node state', 'CreateMemberView', queryNodeStateError)
  }, [queryNodeStateError])

  const accountSet = !!activeAccountId && !!extensionConnected

  const { reset, register, errors, handleSubmit, isValid, getValues, watch } = useCreateEditMemberForm({})

  // success
  useEffect(() => {
    if (!membershipBlock || !queryNodeState || !activeAccountId) {
      return
    }

    if (queryNodeState.indexerHead >= membershipBlock) {
      // trigger membership refetch
      closeCreatingMemberDialog()
      refetchMemberships().then(({ data }) => {
        const lastCreatedMembership = data.memberships[data.memberships.length - 1]
        if (lastCreatedMembership) {
          setActiveUser({ memberId: lastCreatedMembership.id, channelId: null })
        }
      })
      setIsCreatingMembership(false)
      reset()
      setMembershipBlock(null)
      displaySnackbar({
        title: 'Your membership has been created',
        description: 'Browse, watch, create, collect videos across the platform and have fun!',
        iconType: 'success',
      })

      if (pathname.search('studio') >= 0) {
        navigate(absoluteRoutes.studio.signIn())
      } else {
        navigate(pathname)
      }
    }
  }, [
    activeAccountId,
    closeCreatingMemberDialog,
    displaySnackbar,
    membershipBlock,
    navigate,
    pathname,
    queryNodeState,
    refetchMemberships,
    reset,
    setActiveUser,
  ])

  const handleCreateMember = handleSubmit(async (data) => {
    if (!activeAccountId) {
      return
    }

    try {
      openCreatingMemberDialog()
      setIsCreatingMembership(true)
      const { block } = await createNewMember(activeAccountId, data)
      setMembershipBlock(block)
    } catch (error) {
      closeCreatingMemberDialog()
      const errorMessage = (error.isAxiosError && (error as AxiosError).response?.data.error) || 'Unknown error'
      openErrorDialog({
        iconType: 'error',
        title: 'Something went wrong...',
        description: `Some unexpected error was encountered. If this persists, our Discord community may be a good place to find some help. Error code: ${errorMessage}`,
        secondaryButton: {
          text: 'Close',
          onClick: () => {
            setIsCreatingMembership(false)
            closeErrorDialog()
          },
        },
      })
    }
  })

  const handleExitClick = () => {
    reset()
    navigate({ search: '' })
  }

  if (queryNodeStateError) {
    return <ViewErrorFallback />
  }
  return (
    <StyledDialogModal
      title="Create a Joystream membership"
      show={show && accountSet && !isCreatingMembership}
      dividers
      as="form"
      onSubmit={handleCreateMember}
      onExitClick={handleExitClick}
      additionalActionsNode={
        <StyledButton disabled={nodeConnectionStatus !== 'connected' || !isValid} type="submit" size="large">
          Create membership
        </StyledButton>
      }
    >
      <Wrapper>
        <Text variant="t200" secondary>
          Membership represents you as a member of the Joystream community - it's your on-chain identity. It lets you
          interact with the network - create a channel, publish content, issue and trade NFTs. It also lets you to
          participate in the platform governance, shaping its future.
        </Text>
        <StyledAvatar
          size="channel-card"
          assetUrl={errors.avatar ? undefined : getValues('avatar')}
          hasAvatarUploadFailed={!!errors.avatar}
        />
      </Wrapper>
      <CreateEditMemberInputs register={register} errors={errors} watch={watch} />
    </StyledDialogModal>
  )
}

type NewMemberResponse = {
  memberId: MemberId
  block: number
}
export const createNewMember = async (accountId: string, inputs: Inputs) => {
  try {
    const body = {
      account: accountId,
      ...inputs,
    }
    const response = await axios.post<NewMemberResponse>(FAUCET_URL, body)
    return response.data
  } catch (error) {
    SentryLogger.error('Failed to create a membership', 'CreateMemberView', error)
    throw error
  }
}
