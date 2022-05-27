import axios, { AxiosError } from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useMatch, useNavigate } from 'react-router'

import { useQueryNodeStateSubscription } from '@/api/hooks'
import { Text } from '@/components/Text'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { Loader } from '@/components/_loaders/Loader'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { absoluteRoutes } from '@/config/routes'
import { FAUCET_URL } from '@/config/urls'
import { useCreateEditMemberForm } from '@/hooks/useCreateEditMember'
import { MemberId } from '@/joystream-lib'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useConnectionStatusStore } from '@/providers/connectionStatus'
import { useSnackbar } from '@/providers/snackbars'
import { useUser } from '@/providers/user'
import { SentryLogger } from '@/utils/logs'

import { StyledAvatar } from './CreateMemberModal.styles'

import { CreateEditMemberInputs } from '../CreateEditMemberInputs'

type Inputs = {
  handle: string | null
  avatar: string | null
  about: string | null
}

type CreateMemberModalProps = {
  show: boolean
  selectedAccountAddress?: string
}

export const CreateMemberModal: React.FC<CreateMemberModalProps> = ({ show, selectedAccountAddress }) => {
  const { activeAccountId, refetchMemberships, extensionConnected, setActiveUser } = useUser()
  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const isSignIn = useMatch(absoluteRoutes.studio.signIn())
  const isStudio = pathname.search(absoluteRoutes.studio.index()) !== -1
  const accountIdRef = useRef(activeAccountId)

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

  const accountSet = !!selectedAccountAddress && !!extensionConnected

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

      if (isStudio) {
        navigate(isSignIn ? absoluteRoutes.studio.newChannel() : absoluteRoutes.studio.signIn())
      } else {
        navigate(pathname)
      }
    }
  }, [
    activeAccountId,
    closeCreatingMemberDialog,
    displaySnackbar,
    isSignIn,
    isStudio,
    membershipBlock,
    navigate,
    pathname,
    queryNodeState,
    refetchMemberships,
    reset,
    setActiveUser,
  ])

  const handleCreateMember = handleSubmit(async (data) => {
    if (!selectedAccountAddress) {
      return
    }

    try {
      setActiveUser({ accountId: selectedAccountAddress })
      openCreatingMemberDialog()
      setIsCreatingMembership(true)
      const { block } = await createNewMember(selectedAccountAddress, data)
      setMembershipBlock(block)
    } catch (error) {
      setActiveUser({ accountId: accountIdRef.current })
      closeCreatingMemberDialog()
      const errorMessage =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (error.isAxiosError && ((error as AxiosError).response?.data as any)?.error) || 'Unknown error'
      openErrorDialog({
        type: 'destructive',
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
    <DialogModal
      title="Create a Joystream membership"
      size="medium"
      show={show && accountSet && !isCreatingMembership}
      dividers
      as="form"
      onSubmit={handleCreateMember}
      onExitClick={handleExitClick}
      primaryButton={{
        text: 'Create membership',
        disabled: nodeConnectionStatus !== 'connected' || !isValid,
        type: 'submit',
      }}
    >
      <div>
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
      </div>
      <CreateEditMemberInputs register={register} errors={errors} watch={watch} />
    </DialogModal>
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
