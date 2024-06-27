import styled from '@emotion/styled'
import debouncePromise from 'awesome-debounce-promise'
import { ChangeEventHandler, ForwardedRef, forwardRef, useEffect, useRef, useState } from 'react'
import { Controller, FormProvider, useController, useForm, useFormContext } from 'react-hook-form'

import { AppLogo } from '@/components/AppLogo'
import { Avatar } from '@/components/Avatar'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { FormField } from '@/components/_inputs/FormField'
import { Input, InputProps } from '@/components/_inputs/Input'
import { ImageInputFile } from '@/components/_inputs/MultiFileSelect'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { ImageCropModal, ImageCropModalImperativeHandle } from '@/components/_overlays/ImageCropModal'
import { MEMBERSHIP_NAME_PATTERN } from '@/config/regex'
import { useMountEffect } from '@/hooks/useMountEffect'
import { useUniqueMemberHandle } from '@/hooks/useUniqueMemberHandle'
import { cVar, media, sizes } from '@/styles'

export type NewHandleForm = {
  handle?: string
  avatar?: ImageInputFile
}

type CreatePasswordProps = {
  defaultValues?: NewHandleForm
  onSubmit: (data: NewHandleForm) => void
  setActionButtonHandler: (fn: () => void | Promise<void>) => void
}

export const CreateHandle = ({ setActionButtonHandler, onSubmit, defaultValues }: CreatePasswordProps) => {
  const form = useForm<NewHandleForm>({ reValidateMode: 'onSubmit', defaultValues })
  const {
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = form
  const handleInputRef = useRef<HTMLInputElement | null>(null)
  const avatarDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const backgroundImage = watch('avatar')?.url || undefined

  const [isHandleValidating, setIsHandleValidating] = useState(false)

  useMountEffect(() => {
    setActionButtonHandler(() => {
      handleSubmit((data) => {
        onSubmit(data)
      })()
    })
  })

  useEffect(() => {
    if (errors.handle) {
      handleInputRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [errors.handle])

  return (
    <>
      <CustomBackgroundContainer darkBackground hasDivider hasBottomPadding>
        {backgroundImage && <BackgroundImage src={backgroundImage} alt="" />}
        <FlexBox flow="column" gap={6}>
          <StyledAppLogo variant="short-monochrome" />
          <FlexBox flow="column" gap={2}>
            <Text margin={{ bottom: 10 }} variant="h500" as="h3">
              Create membership
            </Text>
          </FlexBox>
        </FlexBox>
      </CustomBackgroundContainer>

      <FormProvider {...form}>
        <StyledForm onSubmit={handleSubmit(onSubmit)}>
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
    </>
  )
}

export const BackgroundImage = styled.img`
  position: absolute;
  filter: blur(${sizes(8)});
  opacity: 0.25;
  top: 0;
  left: 0;
  object-fit: cover;
  width: 100%;
  height: 100%;
  z-index: -1;
`

type CustomBackgroundContainerProps = {
  darkBackground?: boolean
  hasNegativeBottomMargin?: boolean
  hasDivider?: boolean
  hasBottomPadding?: boolean
}

export const CustomBackgroundContainer = styled.div<CustomBackgroundContainerProps>`
  position: relative;
  overflow: hidden;
  z-index: 0;
  margin: calc(-1 * var(--local-size-dialog-padding)) calc(-1 * var(--local-size-dialog-padding)) 0
    calc(-1 * var(--local-size-dialog-padding));
  padding: var(--local-size-dialog-padding);
  background-color: ${({ darkBackground }) => (darkBackground ? cVar('colorBackground') : 'unset')};
  box-shadow: cVar('effectDividersBottom');
`

export const StyledForm = styled.form`
  position: relative;
  padding-top: ${sizes(17)};
  display: grid;
  gap: ${sizes(6)};
  margin-bottom: ${sizes(6)};
`

export const StyledDialogModal = styled(DialogModal)`
  max-height: calc(100vh - 80px);
  ${media.sm} {
    max-height: 576px;
  }
`

export const SubtitleContainer = styled.div`
  display: inline-block;
  text-decoration: none;
  margin-top: ${sizes(2)};
  margin-bottom: ${sizes(11)};
`

export const StyledAvatar = styled(Avatar)`
  position: absolute;
  transform: translateY(-50%);
  top: 0;
`

const StyledAppLogo = styled(AppLogo)`
  height: 36px;
  width: auto;

  path {
    fill: ${cVar('colorTextMuted')};
  }
`

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
