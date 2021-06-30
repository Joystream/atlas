import { useApolloClient } from '@apollo/client'
import debouncePromise from 'awesome-debounce-promise'
import axios, { AxiosError } from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { useQueryNodeStateSubscription } from '@/api/hooks'
import { GetMembershipDocument, GetMembershipQuery, GetMembershipQueryVariables } from '@/api/queries'
import { MEMBERSHIP_NAME_PATTERN, URL_PATTERN } from '@/config/regex'
import { absoluteRoutes } from '@/config/routes'
import { FAUCET_URL } from '@/config/urls'
import { MemberId } from '@/joystream-lib'
import { useConnectionStatusStore, useDialog, useUser } from '@/providers'
import { Spinner } from '@/shared/components'
import { TextArea } from '@/shared/components/TextArea'
import { textFieldValidation } from '@/utils/formValidationOptions'
import { Logger } from '@/utils/logger'

import {
  Form,
  Header,
  Hero,
  StyledAvatar,
  StyledButton,
  StyledTextField,
  SubTitle,
  Wrapper,
} from './CreateMemberView.style'

type Inputs = {
  handle: string
  avatar: string
  about: string
}

export const CreateMemberView = () => {
  const { activeAccountId, refetchMemberships } = useUser()
  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    shouldFocusError: false,
    defaultValues: {
      handle: '',
      avatar: '',
      about: '',
    },
  })

  const [membershipBlock, setMembershipBlock] = useState<number | null>(null)
  const [avatarImageUrl, setAvatarImageUrl] = useState('')
  const [openCreatingMemberDialog, closeCreatingMemberDialog] = useDialog({
    exitButton: false,
    icon: <Spinner />,
    title: 'Creating membership...',
    description:
      "Please wait while your membership is being created. Our faucet server will create it for you so you don't need to worry about any fees. This should take about 15 seconds.",
  })
  const [openErrorDialog, closeErrorDialog] = useDialog()

  const { queryNodeState, error: queryNodeStateError } = useQueryNodeStateSubscription({ skip: !membershipBlock })
  if (queryNodeStateError) {
    throw queryNodeStateError
  }

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
      const { block } = await createNewMember(activeAccountId, data)
      setMembershipBlock(block)
    } catch (error) {
      closeCreatingMemberDialog()
      const errorMessage = (error.isAxiosError && (error as AxiosError).response?.data.error) || 'Unknown error'
      openErrorDialog({
        variant: 'error',
        title: 'Something went wrong...',
        description: `Some unexpected error was encountered. If this persists, our Discord community may be a good place to find some help. Error code: ${errorMessage}`,
        secondaryButtonText: 'Close',
        onSecondaryButtonClick: () => closeErrorDialog(),
      })
    }
  })

  const debouncedHandleAvatarChange = useRef(debouncePromise((value: string) => setAvatarImageUrl(value), 500))

  const debouncedAvatarValidation = useRef(
    debouncePromise(
      async (value: string): Promise<string | boolean> =>
        new Promise((resolve) => {
          if (!value) resolve(true)
          const img = new Image()
          img.src = value
          img.onerror = () => resolve('Image not found')
          img.onload = () => {
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

  return (
    <Wrapper>
      <Header>
        <Hero variant="h2">Create your Joystream membership</Hero>
        <SubTitle variant="body1" secondary>
          Membership represents you as a member of the Joystream community. You can use it to create a channel and
          publish content. It also allows you to participate in the platform governance, shaping its future.
        </SubTitle>
      </Header>
      <Form onSubmit={handleCreateMember}>
        <StyledAvatar size="view" assetUrl={errors.avatar ? undefined : avatarImageUrl} />
        <StyledTextField
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
          onChange={(e) => debouncedHandleAvatarChange.current(e.target.value)}
          error={!!errors.avatar}
          helperText={errors.avatar?.message}
        />
        <StyledTextField
          placeholder="johnnysmith"
          label="Member handle"
          {...register(
            'handle',
            textFieldValidation({
              name: 'Member handle',
              maxLength: 40,
              minLength: 4,
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
        <StyledButton disabled={nodeConnectionStatus !== 'connected'} type="submit" size="large">
          Create membership
        </StyledButton>
      </Form>
    </Wrapper>
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
    Logger.error('Failed to create a new member', error)
    throw error
  }
}
