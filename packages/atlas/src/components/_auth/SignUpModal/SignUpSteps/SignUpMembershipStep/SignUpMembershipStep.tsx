import debouncePromise from 'awesome-debounce-promise'
import {
  ChangeEventHandler,
  FC,
  ForwardedRef,
  RefObject,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Controller, FormProvider, useController, useForm, useFormContext } from 'react-hook-form'
import shallow from 'zustand/shallow'

import { AuthenticationModalStepTemplate } from '@/components/_auth/AuthenticationModalStepTemplate'
import { TextButton } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { Input, InputProps } from '@/components/_inputs/Input'
import { ImageCropModal, ImageCropModalImperativeHandle } from '@/components/_overlays/ImageCropModal'
import { MEMBERSHIP_NAME_PATTERN } from '@/config/regex'
import { MemberFormData } from '@/hooks/useCreateMember'
import { useUniqueMemberHandle } from '@/hooks/useUniqueMemberHandle'
import { useAuthStore } from '@/providers/auth/auth.store'

import { StyledAvatar, StyledForm, SubtitleContainer } from './SignUpMembershipStep.styles'

import { SignUpStepsCommonProps } from '../SignUpSteps.types'

type SignInModalMembershipStepProps = SignUpStepsCommonProps & {
  onSubmit: (data: MemberFormData) => void
  dialogContentRef?: RefObject<HTMLDivElement>
} & Pick<MemberFormData, 'avatar' | 'handle'>

export const SignUpMembershipStep: FC<SignInModalMembershipStepProps> = ({
  setPrimaryButtonProps,
  onSubmit,
  hasNavigatedBack,
  avatar,
  handle,
}) => {
  const form = useForm<MemberFormData>({ reValidateMode: 'onSubmit', defaultValues: { avatar, handle } })
  const {
    handleSubmit: createSubmitHandler,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = form
  const { setAuthModalOpenName } = useAuthStore(
    (state) => ({
      setAuthModalOpenName: state.actions.setAuthModalOpenName,
    }),
    shallow
  )
  const handleInputRef = useRef<HTMLInputElement | null>(null)
  const avatarDialogRef = useRef<ImageCropModalImperativeHandle>(null)

  const [isHandleValidating, setIsHandleValidating] = useState(false)

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
        <SubtitleContainer>
          Already have an account? <TextButton onClick={() => setAuthModalOpenName('logIn')}>Sign in</TextButton>
        </SubtitleContainer>
      }
      hasNavigatedBack={hasNavigatedBack}
      formNode={
        <FormProvider {...form}>
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
                    assetUrls={imageInputFile?.url ? [imageInputFile.url] : []}
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
              <HandleInput
                ref={handleInputRef}
                name="handle"
                placeholder="johnnysmith"
                error={!!errors.handle}
                processing={isHandleValidating || isSubmitting}
                autoComplete="off"
                setIsHandleValidating={setIsHandleValidating}
              />
            </FormField>
          </StyledForm>
        </FormProvider>
      }
    />
  )
}

type HandleInputProps = InputProps & {
  name: string
  setIsHandleValidating: (v: boolean) => void
}

const HandleInput = forwardRef(
  (
    { name, setIsHandleValidating, processing, ...inputProps }: HandleInputProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const { checkIfMemberIsAvailable } = useUniqueMemberHandle()

    const { control, trigger } = useFormContext()
    const { field } = useController({
      name,
      control,
      rules: {
        validate: {
          valid: (value) => (!value ? true : MEMBERSHIP_NAME_PATTERN.test(value) || 'Enter a valid member handle.'),
          unique: async (value) => (await checkIfMemberIsAvailable(value)) || 'This member handle is already in use.',
        },
        required: { value: true, message: 'Member handle is required.' },
        minLength: { value: 5, message: 'Member handle must be at least 5 characters long.' },
      },
    })

    const debouncedHandleValidation = useRef(
      debouncePromise(async () => {
        await trigger(name)
        setIsHandleValidating(false)
      }, 500)
    )
    const handleChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
      const value = evt.target.value?.toLowerCase().replace(/[^0-9_a-z]/g, '_')
      field.onChange(value)
      if (!processing) setIsHandleValidating(true)
      debouncedHandleValidation.current()
    }

    return (
      <Input
        {...inputProps}
        {...field}
        ref={(e) => {
          field.ref(e)
          if (ref && 'current' in ref) ref.current = e
          else ref?.(e)
        }}
        processing={processing}
        onChange={handleChange}
      />
    )
  }
)
HandleInput.displayName = 'HandleInput'
