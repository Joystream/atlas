import { MessageDialog } from '@/components/Dialogs'
import { absoluteRoutes } from '@/config/routes'
import { useUser, useConnectionStatus } from '@/hooks'
import { Spinner } from '@/shared/components'
import TextArea from '@/shared/components/TextArea'
import { textFieldValidation } from '@/utils/formValidationOptions'
import { debounce } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { FAUCET_URL } from '@/config/urls'
import {
  Form,
  StyledButton,
  Wrapper,
  Header,
  Hero,
  SubTitle,
  StyledAvatar,
  StyledTextField,
} from './CreateMemberView.style'
import { useQueryNodeStateSubscription, useMembership } from '@/api/hooks'

import axios, { AxiosError } from 'axios'
import { MemberId } from '@/joystream-lib'
import { MEMBERSHIP_NAME_PATTERN, URL_PATTERN } from '@/config/regex'

type Inputs = {
  handle: string
  avatar: string
  about: string
}

const CreateMemberView = () => {
  const { activeAccountId, refetchMemberships } = useUser()
  const { nodeConnectionStatus } = useConnectionStatus()

  const navigate = useNavigate()
  const { register, handleSubmit, errors, trigger, watch } = useForm<Inputs>({
    shouldFocusError: false,
    defaultValues: {
      handle: '',
      avatar: '',
      about: '',
    },
  })

  const [membershipBlock, setMembershipBlock] = useState<number | null>(null)
  const [error, setError] = useState<string | undefined>()
  const [avatarImageUrl, setAvatarImageUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { queryNodeState, error: queryNodeStateError } = useQueryNodeStateSubscription({ skip: !membershipBlock })
  if (queryNodeStateError) {
    throw queryNodeStateError
  }

  const { refetch: refetchMember } = useMembership({
    where: { handle: watch('handle') },
  })

  // success
  useEffect(() => {
    if (!isSubmitting || !membershipBlock || !queryNodeState || !activeAccountId) {
      return
    }

    if (queryNodeState.indexerHead >= membershipBlock) {
      // trigger membership refetch
      refetchMemberships().then(() => {
        setIsSubmitting(false)
        navigate(absoluteRoutes.studio.signIn())
      })
    }
  }, [isSubmitting, membershipBlock, queryNodeState, activeAccountId, navigate, refetchMemberships])

  const handleCreateMember = handleSubmit(async (data) => {
    if (!activeAccountId) {
      return
    }

    try {
      setIsSubmitting(true)
      const { block } = await createNewMember(activeAccountId, data)
      setMembershipBlock(block)
    } catch (error) {
      setIsSubmitting(false)
      const errorMessage = (error.isAxiosError && (error as AxiosError).response?.data.error) || 'Unknown error'
      setError(errorMessage)
    }
  })

  const debounceAvatarChange = debounce(async (value) => {
    await trigger('avatar')
    if (!errors.avatar) {
      setAvatarImageUrl(value)
    }
  }, 500)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value
    debounceAvatarChange(value)
  }
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
        <StyledAvatar size="view" imageUrl={errors.avatar ? undefined : avatarImageUrl} />
        <StyledTextField
          name="avatar"
          onChange={handleAvatarChange}
          label="Avatar URL"
          placeholder="https://example.com/avatar.jpeg"
          ref={register(
            textFieldValidation({
              name: 'Avatar URL',
              pattern: URL_PATTERN,
              patternMessage: 'must be a valid url',
              maxLength: 200,
              required: false,
              validate: async (value) => {
                if (!value) return
                return new Promise((resolve) => {
                  debounce(async (handle) => {
                    const img = new Image()
                    img.src = value
                    img.onerror = () => resolve('Image not found')
                    img.onload = () => resolve(true)
                  }, 500)(value)
                })
              },
            })
          )}
          error={!!errors.avatar}
          helperText={errors.avatar?.message}
        />
        <StyledTextField
          name="handle"
          placeholder="johnnysmith"
          label="Member Name"
          ref={register(
            textFieldValidation({
              name: 'Member name',
              maxLength: 40,
              minLength: 4,
              required: true,
              pattern: MEMBERSHIP_NAME_PATTERN,
              patternMessage: 'may contain only lowercase letters, numbers and underscores',
              validate: async (value) => {
                // Wrapping it up with promise and resolving comparison inside debounce
                // debounce() will not automatically do the return, which is needed for validation
                return new Promise((resolve) => {
                  debounce(async (handle) => {
                    const {
                      data: { membershipByUniqueInput },
                    } = await refetchMember()
                    if (membershipByUniqueInput) {
                      resolve('Member name is already taken')
                    } else {
                      resolve(true)
                    }
                  }, 500)(value)
                })
              },
            })
          )}
          error={!!errors.handle}
          helperText={errors.handle?.message}
        />
        <TextArea
          name="about"
          label="About"
          placeholder="Anything you'd like to share about yourself with the Joystream community"
          maxLength={1000}
          ref={register(textFieldValidation({ name: 'About', maxLength: 1000 }))}
          error={!!errors.about}
          helperText={errors.about?.message}
        />
        <StyledButton disabled={nodeConnectionStatus !== 'connected'} type="submit" size="large">
          Create membership
        </StyledButton>
      </Form>
      <MessageDialog
        showDialog={isSubmitting}
        exitButton={false}
        icon={<Spinner />}
        title="Creating membership..."
        description="Please wait while your membership is being created. Our faucet server will create it for you so you don't need to worry about any fees. This should take about 15 seconds."
      />
      <MessageDialog
        variant="error"
        title="Something went wrong..."
        showDialog={!isSubmitting && !!error}
        description={`Some unexpected error was encountered. If this persists, our Discord community may be a good place to find some help. Error code: ${error}`}
        secondaryButtonText="Close"
        onExitClick={() => setError(undefined)}
        onSecondaryButtonClick={() => setError(undefined)}
      />
    </Wrapper>
  )
}

type NewMemberResponse = {
  memberId: MemberId
  block: number
}

const createNewMember = async (accountId: string, inputs: Inputs) => {
  try {
    const body = {
      account: accountId,
      ...inputs,
    }
    const response = await axios.post<NewMemberResponse>(FAUCET_URL, body)
    return response.data
  } catch (error) {
    console.error('Failed to create a new member')
    throw error
  }
}

export default CreateMemberView
