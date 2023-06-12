import { useApolloClient } from '@apollo/client'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import debouncePromise from 'awesome-debounce-promise'
import { FC, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
  GetMembershipsDocument,
  GetMembershipsQuery,
  GetMembershipsQueryVariables,
} from '@/api/queries/__generated__/memberships.generated'
import { Text } from '@/components/Text'
import { AuthenticationModalStepTemplate } from '@/components/_auth/AuthenticationModalStepTemplate'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { ImageCropModal, ImageCropModalImperativeHandle } from '@/components/_overlays/ImageCropModal'
import { atlasConfig } from '@/config'
import { MEMBERSHIP_NAME_PATTERN } from '@/config/regex'

import { Anchor, StyledAvatar, StyledForm } from './SignUpMembershipStep.styles'

import { MemberFormData } from '../../SignUpModal.types'
import { SignUpStepsCommonProps } from '../SignUpSteps.types'

type SignInModalMembershipStepProps = SignUpStepsCommonProps & {
  onSubmit: (data: MemberFormData) => void
  dialogContentRef?: RefObject<HTMLDivElement>
} & Pick<MemberFormData, 'avatar' | 'handle'>

export const SignUpMembershipStep: FC<SignInModalMembershipStepProps> = ({
  setPrimaryButtonProps,
  onSubmit,
  hasNavigatedBack,
  dialogContentRef,
  avatar,
  handle,
}) => {
  const {
    register,
    handleSubmit: createSubmitHandler,
    trigger,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MemberFormData>({
    reValidateMode: 'onSubmit',
    defaultValues: {
      avatar,
      handle,
    },
  })

  const handleInputRef = useRef<HTMLInputElement | null>(null)
  const avatarDialogRef = useRef<ImageCropModalImperativeHandle>(null)

  const [isHandleValidating, setIsHandleValidating] = useState(false)
  // used to scroll the form to the bottom upon first handle field focus - this is done to let the user see Captcha form field
  const hasDoneInitialScroll = useRef(false)

  const client = useApolloClient()

  const validateUserHandle = useCallback(
    async (value: string) => {
      const {
        data: { memberships },
      } = await client.query<GetMembershipsQuery, GetMembershipsQueryVariables>({
        query: GetMembershipsDocument,
        variables: { where: { handle_eq: value } },
      })

      return !memberships[0]
    },
    [client]
  )

  const requestFormSubmit = useCallback(() => {
    setIsHandleValidating(false)
    createSubmitHandler(onSubmit)()
  }, [onSubmit, createSubmitHandler])

  // send updates to SignInModal on state of primary button
  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Continue',
      disabled: isSubmitting,
      onClick: requestFormSubmit,
    })
  }, [isHandleValidating, isSubmitting, requestFormSubmit, setPrimaryButtonProps])

  const { ref, ...handleRest } = useMemo(
    () =>
      register('handle', {
        onChange: debouncePromise(
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
      }),
    [register, trigger, validateUserHandle]
  )

  useEffect(() => {
    if (errors.handle) {
      handleInputRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [errors.handle])

  return (
    <AuthenticationModalStepTemplate
      darkBackground
      title="Create membership"
      backgroundImage={watch('avatar')?.url || undefined}
      subtitle={
        <>
          To get the full {atlasConfig.general.appName} experience, you need a free Joystream blockchain membership.
          <Text as="p" variant="t100" color="inherit">
            <Anchor href={atlasConfig.general.joystreamLandingPageUrl} target="_blank">
              Learn about Joystream &rarr;
            </Anchor>
          </Text>
        </>
      }
      hasNavigatedBack={hasNavigatedBack}
      formNode={
        <StyledForm onSubmit={createSubmitHandler(onSubmit)}>
          <Controller
            control={control}
            name="avatar"
            render={({ field: { value: imageInputFile, onChange } }) => (
              <>
                <StyledAvatar
                  size={88}
                  onClick={() =>
                    avatarDialogRef.current?.open(
                      imageInputFile?.originalBlob ? imageInputFile.originalBlob : imageInputFile?.blob,
                      imageInputFile?.imageCropData,
                      !!imageInputFile?.blob
                    )
                  }
                  assetUrl={imageInputFile?.url}
                  editable
                />
                <ImageCropModal
                  imageType="avatar"
                  onConfirm={(blob, url, _, imageCropData, originalBlob) => {
                    onChange({
                      blob,
                      url,
                      imageCropData,
                      originalBlob,
                    })
                  }}
                  onDelete={() => {
                    onChange(undefined)
                  }}
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
              onClick={() => {
                if (hasDoneInitialScroll.current || !dialogContentRef?.current) return
                hasDoneInitialScroll.current = true
                dialogContentRef.current.scrollTo({ top: dialogContentRef.current.scrollHeight, behavior: 'smooth' })
              }}
            />
          </FormField>
          {atlasConfig.features.members.hcaptchaSiteKey && (
            <Controller
              control={control}
              name="captchaToken"
              render={({ field: { onChange }, fieldState: { error } }) => (
                <FormField error={error?.message}>
                  <HCaptcha
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    sitekey={atlasConfig.features.members.hcaptchaSiteKey!}
                    theme="dark"
                    languageOverride="en"
                    onVerify={(token) => {
                      onChange(token)
                      trigger('captchaToken')
                    }}
                  />
                </FormField>
              )}
              rules={{
                required: {
                  value: !!atlasConfig.features.members.hcaptchaSiteKey,
                  message: "Verify that you're not a robot.",
                },
              }}
            />
          )}
        </StyledForm>
      }
    />
  )
}
