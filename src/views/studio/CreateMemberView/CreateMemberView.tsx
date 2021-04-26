import { ActionDialog, MessageDialog } from '@/components/Dialogs'
import { absoluteRoutes } from '@/config/routes'
import { useActiveUser, useConnectionStatus } from '@/hooks'
import { Spinner, Text } from '@/shared/components'
import TextArea from '@/shared/components/TextArea'
import { textFieldValidation, urlValidation } from '@/utils/formValidationOptions'
import { debounce } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { FAUCET_URL } from '@/config/urls'
import {
  Form,
  StyledButton,
  Wrapper,
  StyledText,
  Header,
  Hero,
  SubTitle,
  StyledAvatar,
  StyledTextField,
} from './CreateMemberView.style'
import { useMemberships, useQueryNodeStateSubscription } from '@/api/hooks'
import axios, { AxiosError } from 'axios'
import { MemberId } from '@/joystream-lib'

type Inputs = {
  handle: string
  avatar: string
  about: string
}

const CreateMemberView = () => {
  const { activeUser } = useActiveUser()
  const { nodeConnectionStatus } = useConnectionStatus()

  const navigate = useNavigate()
  const { register, handleSubmit, errors, trigger, setError: setInputError } = useForm<Inputs>({
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

  const { error: membershipError, refetch: refetchMembership } = useMemberships(
    {
      where: {
        // `controllerAccount_in` has to be used to trigger refresh on other queries using it
        controllerAccount_in: [activeUser.accountId || ''],
      },
    },
    {
      skip: !activeUser.accountId,
    }
  )
  if (membershipError) {
    throw membershipError
  }

  // success
  useEffect(() => {
    if (!isSubmitting || !membershipBlock || !queryNodeState || !activeUser.accountId) {
      return
    }

    if (queryNodeState.indexerHead >= membershipBlock) {
      // trigger membership refetch
      refetchMembership().then(() => {
        setIsSubmitting(false)
        navigate(absoluteRoutes.studio.signIn())
      })
    }
  }, [isSubmitting, membershipBlock, queryNodeState, activeUser.accountId, navigate, refetchMembership])

  const handleCreateMember = handleSubmit(async (data) => {
    if (!activeUser.accountId) {
      return
    }

    try {
      setIsSubmitting(true)
      const { block } = await createNewMember(activeUser.accountId, data)
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
        <Hero variant="h2">Create Joystream membership</Hero>
        <SubTitle variant="body1" secondary>
          Start your journey as a Video Publisher. Create, manage and modify your channel and video content.
        </SubTitle>
      </Header>
      <Form onSubmit={handleCreateMember}>
        <StyledAvatar
          size="view"
          imageUrl={errors.avatar ? undefined : avatarImageUrl}
          onError={() => setInputError('avatar', { message: 'Image not found' })}
        />
        <StyledTextField
          name="avatar"
          onChange={handleAvatarChange}
          label="Avatar url"
          placeholder="http://link_to_avatar_file"
          ref={register(urlValidation('Avatar url'))}
          error={!!errors.avatar}
          helperText={errors.avatar?.message}
        />
        <StyledTextField
          name="handle"
          placeholder="Johnny Smith"
          label="Member Name"
          ref={register(textFieldValidation('Member name', 4, 40, true))}
          error={!!errors.handle}
          helperText={errors.handle?.message}
        />
        <TextArea
          name="about"
          label="About me"
          placeholder="Describe yourself here..."
          maxLength={100}
          ref={register(textFieldValidation('About', 0, 100))}
          error={!!errors.about}
          helperText={errors.about?.message}
        />
        <StyledButton disabled={nodeConnectionStatus !== 'connected'} type="submit">
          Create membership
        </StyledButton>
      </Form>
      <ActionDialog showDialog={isSubmitting} exitButton={false}>
        <Spinner />
        <Text variant="h4">Creating Membership...</Text>
        <StyledText variant="body2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero rem facilis assumenda consequuntur nostrum
          inventore earum molestias ab quidem odio!
        </StyledText>
      </ActionDialog>
      <MessageDialog
        variant="error"
        title="Some unexpected error occurred. "
        showDialog={!isSubmitting && !!error}
        description={`Error: ${error}`}
        onExitClick={() => setError(undefined)}
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
