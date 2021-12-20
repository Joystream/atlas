import { useApolloClient } from '@apollo/client'
import debouncePromise from 'awesome-debounce-promise'
import axios, { AxiosError } from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { useQueryNodeStateSubscription } from '@/api/hooks'
import { GetMembershipDocument, GetMembershipQuery, GetMembershipQueryVariables } from '@/api/queries'
import { Text } from '@/components/Text'
import { ViewErrorFallback } from '@/components/ViewErrorFallback'
import { TextArea } from '@/components/_inputs/TextArea'
import { Loader } from '@/components/_loaders/Loader'
import { MEMBERSHIP_NAME_PATTERN, URL_PATTERN } from '@/config/regex'
import { absoluteRoutes } from '@/config/routes'
import { FAUCET_URL } from '@/config/urls'
import { useRouterQuery } from '@/hooks/useRouterQuery'
import { MemberId } from '@/joystream-lib'
import { useConfirmationModal } from '@/providers/confirmationModal'
import { useConnectionStatusStore } from '@/providers/connectionStatus'
import { useUser } from '@/providers/user'
import { textFieldValidation } from '@/utils/formValidationOptions'
import { SentryLogger } from '@/utils/logs'

import { StyledAvatar, StyledButton, StyledDialogModal, StyledTextField, Wrapper } from './CreateMemberModal.styles'

type Inputs = {
  handle: string
  avatar: string
  about: string
}

export const CreateMemberModal: React.FC = () => {
  const { activeAccountId, refetchMemberships, extensionConnected } = useUser()
  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)
  const step = useRouterQuery('step')
  const navigate = useNavigate()

  const accountSet = !!activeAccountId && !!extensionConnected

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<Inputs>({
    mode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      handle: '',
      avatar: '',
      about: '',
    },
  })

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

  const { queryNodeState, error: queryNodeStateError } = useQueryNodeStateSubscription({ skip: !membershipBlock })
  // subscription doesn't allow 'onError' callback
  useEffect(() => {
    if (!queryNodeStateError) return
    SentryLogger.error('Failed to subscribe to query node state', 'CreateMemberView', queryNodeStateError)
  }, [queryNodeStateError])

  const client = useApolloClient()

  // success
  useEffect(() => {
    if (!membershipBlock || !queryNodeState || !activeAccountId) {
      return
    }

    if (queryNodeState.indexerHead >= membershipBlock) {
      // trigger membership refetch
      closeCreatingMemberDialog()
      refetchMemberships().then(() => {
        navigate(absoluteRoutes.studio.signIn())
      })
    }
  }, [activeAccountId, closeCreatingMemberDialog, membershipBlock, navigate, queryNodeState, refetchMemberships])

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

  const debouncedAvatarValidation = useRef(
    debouncePromise(
      async (value: string): Promise<string | boolean> =>
        new Promise((resolve) => {
          const image = new Image()
          image.onload = () => {
            setAvatarImageUrl(value)
            resolve(true)
          }
          image.onerror = () => resolve('Image not found')
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
        return 'Member handle already in use'
      } else {
        return true
      }
    }, 500)
  )

  const handleExitClick = () => {
    reset()
    navigate('?step=0')
  }

  if (queryNodeStateError) {
    return <ViewErrorFallback />
  }
  return (
    <StyledDialogModal
      title="Create Membership"
      show={step === 'membership' && !isCreatingMembership && accountSet}
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
          {...register(
            'avatar',
            textFieldValidation({
              name: 'Avatar URL',
              pattern: URL_PATTERN,
              patternMessage: 'must be a valid url',
              maxLength: 200,
              required: false,
              validate: debouncedAvatarValidation.current,
            })
          )}
          error={!!errors.avatar}
          helperText={errors.avatar?.message}
        />
        <StyledTextField
          autoComplete="off"
          placeholder="johnnysmith"
          label="Member handle"
          {...register(
            'handle',
            textFieldValidation({
              name: 'Member handle',
              maxLength: 40,
              minLength: 5,
              required: true,
              pattern: MEMBERSHIP_NAME_PATTERN,
              patternMessage: 'may contain only lowercase letters, numbers and underscores',
              validate: debouncedHandleUniqueValidation.current,
            })
          )}
          error={!!errors.handle}
          helperText={
            errors.handle?.message || 'Member handle may contain only lowercase letters, numbers and underscores'
          }
        />
        <TextArea
          label="About"
          placeholder="Anything you'd like to share about yourself with the Joystream community"
          maxLength={1000}
          {...register('about', textFieldValidation({ name: 'About', maxLength: 1000 }))}
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
