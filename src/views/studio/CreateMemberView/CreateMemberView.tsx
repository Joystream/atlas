import { ActionDialog } from '@/components/Dialogs'
import { absoluteRoutes } from '@/config/routes'
import { useActiveUser, useConnectionStatus, useSnackbar } from '@/hooks'
import { Spinner, Text, TextField } from '@/shared/components'
import TextArea from '@/shared/components/TextArea'
import { textFieldValidation, urlValidation } from '@/utils/formValidationOptions'
import { debounce, startCase } from 'lodash'
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
  ErrorMessage,
  StyledAvatar,
} from './CreateMemberView.style'
import { useMemberships } from '@/api/hooks'

type Inputs = {
  handle: string
  avatar: string
  about: string
}

const CreateMemberView = () => {
  const { activeUser } = useActiveUser()
  const { nodeConnectionStatus } = useConnectionStatus()
  const { memberships, startPolling } = useMemberships({
    where: {
      controllerAccount_eq: activeUser.accountId,
    },
  })
  const navigate = useNavigate()
  const { register, handleSubmit, errors, trigger, setError: setInputError } = useForm<Inputs>({
    shouldFocusError: false,
    defaultValues: {
      handle: '',
      avatar: '',
      about: '',
    },
  })

  const [status, setStatus] = useState<'success' | 'error' | undefined>()
  const [error, setError] = useState<string | undefined>()
  const [avatarImageUrl, setAvatarImageUrl] = useState('')
  const [isLoadingDialogVisible, setIsLoadingDialogVisible] = useState(false)

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

  useEffect(() => {
    if (!isLoadingDialogVisible) {
      return
    }
    if (status === 'error' && error) {
      error.startsWith('Member name') && setInputError('handle', { message: error })
      setIsLoadingDialogVisible(false)
    }
    if (status === 'success') {
      startPolling(2000)
      if (memberships?.length) {
        navigate(absoluteRoutes.studio.signIn())
      }
    }
  }, [error, isLoadingDialogVisible, memberships?.length, navigate, setInputError, startPolling, status])

  const handleCreateMember = handleSubmit(async (data) => {
    try {
      if (!activeUser.accountId) {
        return
      }
      setIsLoadingDialogVisible(true)
      await createNewMember(activeUser.accountId, data)
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setError(error.message)
    }
  })

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
        {!error?.startsWith('Member name') && <ErrorMessage>{error}</ErrorMessage>}
        <TextField
          name="avatar"
          onChange={handleAvatarChange}
          label="Avatar url"
          placeholder="http://link_to_avatar_file"
          ref={register(urlValidation('Avatar url'))}
          error={!!errors.avatar}
          helperText={errors.avatar?.message}
        />
        <TextField
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
      <ActionDialog showDialog={isLoadingDialogVisible} exitButton={false}>
        <Spinner />
        <Text variant="h4">Creating Membership...</Text>
        <StyledText variant="body2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero rem facilis assumenda consequuntur nostrum
          inventore earum molestias ab quidem odio!
        </StyledText>
      </ActionDialog>
    </Wrapper>
  )
}

const createNewMember = async (accountId: string, inputs: Inputs) => {
  const body = JSON.stringify({
    account: accountId,
    ...inputs,
  })
  try {
    const response = await fetch(FAUCET_URL as string, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
    const json = await response.json()
    if (json.error) {
      throw Error(json.error)
    }
    return json
  } catch (error) {
    const errorMessage = handleFaucetErrors(error.message)
    throw Error(errorMessage)
  }
}

type FaucetErrors =
  | 'OnlyNewAccountsCanBeUsedForScreenedMembers'
  | 'InvalidAddress'
  | 'TransactionError'
  | 'InternalServerError'
  | 'HandleTooLong'
  | 'HandleTooShort'
  | 'HandleAlreadyRegistered'

const handleFaucetErrors = (errorMessage: FaucetErrors) => {
  switch (errorMessage) {
    case 'HandleAlreadyRegistered':
    case 'HandleTooLong':
    case 'HandleTooShort': {
      const message = startCase(errorMessage).toLowerCase().replace('handle', 'Member name is')
      return message
    }
    case 'InvalidAddress':
      return 'Account address is invalid'
    case 'OnlyNewAccountsCanBeUsedForScreenedMembers':
      return 'You can create only one membership per account'
    case 'TransactionError':
      return 'Transaction Error'
    case 'InternalServerError':
      return 'Server Error'
    default:
      return 'Something went wrong'
  }
}

export default CreateMemberView
