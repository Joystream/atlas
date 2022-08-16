import { useApolloClient } from '@apollo/client'
import debouncePromise from 'awesome-debounce-promise'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { GetMembershipDocument, GetMembershipQuery, GetMembershipQueryVariables } from '@/api/queries'
import { Text } from '@/components/Text'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { ImageCropModal, ImageCropModalImperativeHandle } from '@/components/_overlays/ImageCropModal'
import { MEMBERSHIP_NAME_PATTERN } from '@/config/regex'
import { JOYSTREAM_URL } from '@/config/urls'
import { ImageCropData } from '@/types/cropper'

import { SignInModalStepTemplate } from './SignInModalStepTemplate'
import { Anchor, StyledAvatar, StyledForm } from './SignInSteps.styles'
import { SignInStepProps } from './SignInSteps.types'

import { MemberFormData } from '../SignInModal.types'

type SignInModalMembershipStepProps = SignInStepProps & {
  createMember: (data: MemberFormData) => void
}

export const SignInModalMembershipStep: FC<SignInModalMembershipStepProps> = ({
  setPrimaryButtonProps,
  createMember,
  hasNavigatedBack,
}) => {
  const {
    register,
    handleSubmit: createSubmitHandler,
    trigger,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MemberFormData>()
  const handleInputRef = useRef<HTMLInputElement | null>(null)
  const avatarDialogRef = useRef<ImageCropModalImperativeHandle>(null)

  const [originalAvatarFile, setOriginalAvatarFile] = useState<Blob | null>(null)
  const [displayedAvatarUrl, setDisplayedAvatarUrl] = useState<string | null>(null)
  const [avatarCropData, setAvatarCropData] = useState<ImageCropData | undefined>()

  const [isHandleValidating, setIsHandleValidating] = useState(false)

  const client = useApolloClient()

  const handleConfirmAvatar = (croppedUrl: string, cropData: ImageCropData, originalFileBlob: Blob | null) => {
    setDisplayedAvatarUrl(croppedUrl)
    setOriginalAvatarFile(originalFileBlob)
    setAvatarCropData(cropData)
  }

  const handleDeleteAvatar = () => {
    setDisplayedAvatarUrl(null)
    setOriginalAvatarFile(null)
    setAvatarCropData(undefined)
  }

  const debouncePromiseRef = useRef(debouncePromise)

  const validateUserHandle = async (value: string) => {
    const {
      data: { membershipByUniqueInput },
    } = await client.query<GetMembershipQuery, GetMembershipQueryVariables>({
      query: GetMembershipDocument,
      variables: { where: { handle: value } },
    })

    return !membershipByUniqueInput
  }

  const requestFormSubmit = useCallback(() => {
    createSubmitHandler(createMember)()
  }, [createMember, createSubmitHandler])

  // send updates to SignInModal on state of primary button
  useEffect(() => {
    setPrimaryButtonProps({
      text: isSubmitting || isHandleValidating ? 'Please wait...' : 'Create membership',
      disabled: isSubmitting || isHandleValidating,
      onClick: requestFormSubmit,
    })
  }, [isHandleValidating, isSubmitting, requestFormSubmit, setPrimaryButtonProps])

  const { ref, ...handleRest } = register('handle', {
    onChange: debouncePromiseRef.current(
      async () => {
        await trigger('handle')
        setIsHandleValidating(false)
      },
      500,
      {
        key() {
          setIsHandleValidating(true)
          return null
        },
      }
    ),
    validate: {
      valid: (value) => (!value ? true : MEMBERSHIP_NAME_PATTERN.test(value) || 'Enter a valid member handle.'),
      unique: async (value) => {
        const valid = await validateUserHandle(value)
        return valid || 'This member handle is already in use.'
      },
    },
    required: { value: true, message: 'Member handle is required.' },
    minLength: { value: 5, message: 'Member handle must be at least 5 characters long.' },
  })

  useEffect(() => {
    if (errors.handle) {
      handleInputRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [errors.handle])

  return (
    <SignInModalStepTemplate
      darkBackground
      title="Create Joystream membership"
      backgroundImage={displayedAvatarUrl || ''}
      subtitle={
        <>
          To get the full Atlas experience, you need a free Joystream blockchain membership.
          <Text as="p" variant="t100" color="inherit">
            <Anchor href={JOYSTREAM_URL} target="_blank">
              Learn about joystream &rarr;
            </Anchor>
          </Text>
        </>
      }
      hasNavigatedBack={hasNavigatedBack}
      formNode={
        <StyledForm onSubmit={createSubmitHandler(createMember)}>
          <Controller
            control={control}
            name="avatar"
            render={({ field: { value: avatarFile, onChange } }) => (
              <>
                <StyledAvatar
                  size="cover"
                  onClick={() =>
                    avatarDialogRef.current?.open(
                      originalAvatarFile ? originalAvatarFile : avatarFile,
                      avatarCropData,
                      !!avatarFile
                    )
                  }
                  assetUrl={displayedAvatarUrl}
                  editable
                />
                <ImageCropModal
                  imageType="avatar"
                  onConfirm={(croppedBlob, croppedUrl, _2, imageCropData, originalBlob) => {
                    handleConfirmAvatar(croppedUrl, imageCropData, originalBlob)
                    onChange(croppedBlob)
                  }}
                  onDelete={handleDeleteAvatar}
                  ref={avatarDialogRef}
                />
              </>
            )}
          />
          <FormField
            disableErrorAnimation={document.activeElement === handleInputRef.current}
            label="Member handle"
            description="Member handle may contain only lowercase letters, numbers and underscores."
            error={errors.handle?.message}
          >
            <Input
              {...handleRest}
              ref={(e) => {
                ref(e)
                handleInputRef.current = e
              }}
              placeholder="johnnysmith"
              error={!!errors.handle}
              processing={isHandleValidating || isSubmitting}
              autoComplete="off"
            />
          </FormField>
        </StyledForm>
      }
    />
  )
}
