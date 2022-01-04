import { useApolloClient } from '@apollo/client'
import { zodResolver } from '@hookform/resolvers/zod'
import debouncePromise from 'awesome-debounce-promise'
import axios, { AxiosError } from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router'
import * as z from 'zod'

import { useQueryNodeStateSubscription } from '@/api/hooks'
import { GetMembershipDocument, GetMembershipQuery, GetMembershipQueryVariables } from '@/api/queries'
import { Text } from '@/components/Text'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { TextArea } from '@/components/_inputs/TextArea'
import { Loader } from '@/components/_loaders/Loader'
import { MEMBERSHIP_NAME_PATTERN, URL_PATTERN } from '@/config/regex'
import { QUERY_PARAMS } from '@/config/routes'
import { FAUCET_URL } from '@/config/urls'
import { useRouterQuery } from '@/hooks/useRouterQuery'
import { MemberId } from '@/joystream-lib'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useConnectionStatusStore } from '@/providers/connectionStatus'
import { useSnackbar } from '@/providers/snackbars'
import { useUser } from '@/providers/user'
import { SentryLogger } from '@/utils/logs'

import { StyledAvatar, StyledButton, StyledDialogModal, StyledTextField, Wrapper } from './CreateMemberModal.styles'

type Inputs = {
  handle: string
  avatar: string
  about: string
}

export const CreateMemberModal: React.FC = () => {
  const { activeAccountId, refetchMemberships, extensionConnected, setActiveUser } = useUser()
  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)
  const step = useRouterQuery(QUERY_PARAMS.LOGIN)
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [membershipBlock, setMembershipBlock] = useState<number | null>(null)
  const [avatarImageUrl, setAvatarImageUrl] = useState('')
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

  const client = useApolloClient()

  const accountSet = !!activeAccountId && !!extensionConnected

  const debouncedAvatarValidation = useRef(
    debouncePromise(
      async (value: string): Promise<string | boolean> =>
        new Promise((resolve) => {
          const image = new Image()
          image.onload = () => {
            setAvatarImageUrl(value)
            resolve(true)
          }
          image.onerror = () => resolve(false)
          image.src = value
          if (!value) {
            setAvatarImageUrl(value)
            resolve(true)
          }
        }),
      500
    )
  )

  const debouncedHandleUniqueValidation = useRef(
    debouncePromise(async (value: string) => {
      const {
        data: { membershipByUniqueInput },
      } = await client.query<GetMembershipQuery, GetMembershipQueryVariables>({
        query: GetMembershipDocument,
        variables: { where: { handle: value } },
      })
      if (membershipByUniqueInput) {
        return false
      } else {
        return true
      }
    }, 500)
  )

  const schema = z.object({
    handle: z
      .string()
      .nonempty({ message: 'Member handle cannot be empty' })
      .min(5, {
        message: 'Member handle must be at least 5 characters',
      })
      .max(40, {
        message: `Member handle cannot be longer than 40 characters`,
      })
      .refine((val) => (val ? MEMBERSHIP_NAME_PATTERN.test(val) : true), {
        message: 'Member handle may contain only lowercase letters, numbers and underscores',
      })
      .refine(
        async (val) => {
          const isValid = await debouncedHandleUniqueValidation.current(val)
          return isValid
        },
        { message: 'Member handle already in use' }
      ),
    avatar: z
      .string()
      .max(400)
      .refine((val) => (val ? URL_PATTERN.test(val) : true), { message: 'Avatar URL must be a valid url' })
      .refine(
        async (val) => {
          const isValid = await debouncedAvatarValidation.current(val)
          return isValid
        },
        { message: 'Image not found' }
      )
      .optional(),
    about: z.string().max(1000, { message: 'About cannot be longer than 1000 characters' }).optional(),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<Inputs>({
    mode: 'onChange',
    resolver: zodResolver(schema, { async: true }),
    shouldFocusError: true,
    defaultValues: {
      handle: '',
      avatar: '',
      about: '',
    },
  })

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
      navigate(pathname)
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
      title="Create Membership"
      show={step === 'member' && accountSet && !isCreatingMembership}
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
          Membership represents you as a member of the Joystream community. You can use it to create a channel and
          publish content. It also allows you to participate in the platform governance, shaping its future.
        </Text>
        <StyledAvatar
          size="channel-card"
          assetUrl={errors.avatar ? undefined : avatarImageUrl}
          hasAvatarUploadFailed={!!errors.avatar}
        />
        <StyledTextField
          autoComplete="off"
          label="Avatar URL"
          placeholder="https://example.com/avatar.jpeg"
          {...register('avatar')}
          error={!!errors.avatar}
          helperText={errors.avatar?.message}
        />
        <StyledTextField
          autoComplete="off"
          placeholder="johnnysmith"
          label="Member handle"
          {...register('handle')}
          error={!!errors.handle}
          helperText={
            errors.handle?.message || 'Member handle may contain only lowercase letters, numbers and underscores'
          }
        />
        <TextArea
          label="About"
          placeholder="Anything you'd like to share about yourself with the Joystream community"
          maxLength={1000}
          {...register('about')}
          error={!!errors.about}
          helperText={errors.about?.message}
        />
      </Wrapper>
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
