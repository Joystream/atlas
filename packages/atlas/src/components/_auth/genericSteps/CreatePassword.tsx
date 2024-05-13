import styled from '@emotion/styled'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { zodResolver } from '@hookform/resolvers/zod'
import { RefObject, useEffect, useRef } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'

import { AppLogo } from '@/components/AppLogo'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { PasswordCriterias } from '@/components/_auth/PasswordCriterias'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { atlasConfig } from '@/config'
import { useHidePasswordInInput } from '@/hooks/useHidePasswordInInput'
import { useMountEffect } from '@/hooks/useMountEffect'
import { cVar, sizes } from '@/styles'
import { passwordAndRepeatPasswordSchema } from '@/utils/formValidationOptions'

type NewPasswordForm = {
  password: string
  confirmPassword: string
  captchaToken?: string
}

type CreatePasswordProps = {
  defaultValues?: Omit<NewPasswordForm, 'captchaToken'>
  onSubmit: (data: NewPasswordForm) => void
  setActionButtonHandler: (fn: () => void | Promise<void>) => void
  dialogContentRef?: RefObject<HTMLDivElement>
}

export const CreatePassword = ({
  setActionButtonHandler,
  onSubmit,
  defaultValues,
  dialogContentRef,
}: CreatePasswordProps) => {
  const form = useForm<NewPasswordForm>({
    shouldFocusError: true,
    reValidateMode: 'onSubmit',
    defaultValues,
    resolver: zodResolver(passwordAndRepeatPasswordSchema),
  })
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
    trigger,
  } = form
  const [hidePasswordProps] = useHidePasswordInInput()
  const [hideConfirmPasswordProps] = useHidePasswordInInput()

  const captchaRef = useRef<HCaptcha | null>(null)
  const captchaInputRef = useRef<HTMLDivElement | null>(null)

  useMountEffect(() => {
    setActionButtonHandler(() => {
      handleSubmit((data) => {
        onSubmit(data)
      })()
      captchaRef.current?.resetCaptcha()
    })
  })

  useEffect(() => {
    if (errors.captchaToken) {
      captchaInputRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [errors.captchaToken])

  // used to scroll the form to the bottom upon first handle field focus - this is done to let the user see password requirements & captcha
  const hasDoneInitialScroll = useRef(false)

  return (
    <FormProvider {...form}>
      <FlexBox flow="column" gap={6}>
        <StyledAppLogo variant="short-monochrome" />
        <FlexBox flow="column" gap={2}>
          <Text variant="h500" as="h3">
            Create a password
          </Text>
          <Text margin={{ bottom: 2 }} variant="t300" as="span" color="colorText">
            Please note that there is no option for us to recover your password if you forget it.
          </Text>
        </FlexBox>
        <StyledSignUpForm>
          <FormField label="Password" error={errors.password?.message}>
            <Input
              data-ls-disabled
              placeholder="Password"
              {...register('password')}
              {...hidePasswordProps}
              onClick={() => {
                if (hasDoneInitialScroll.current || !dialogContentRef?.current) return
                hasDoneInitialScroll.current = true
                dialogContentRef.current.scrollTo({ top: dialogContentRef.current.scrollHeight, behavior: 'smooth' })
              }}
            />
          </FormField>
          <FormField label="Repeat Password" error={errors.confirmPassword?.message}>
            <Input
              data-ls-disabled
              placeholder="Repeat password"
              {...register('confirmPassword')}
              {...hideConfirmPasswordProps}
              autoComplete="off"
            />
          </FormField>
          <PasswordCriterias />
          {atlasConfig.features.members.hcaptchaSiteKey && (
            <Controller
              control={control}
              name="captchaToken"
              render={({ field: { onChange }, fieldState: { error } }) => (
                <FormField error={error?.message} ref={captchaInputRef}>
                  <HCaptcha
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    sitekey={atlasConfig.features.members.hcaptchaSiteKey!}
                    theme="dark"
                    languageOverride="en"
                    ref={captchaRef}
                    onVerify={(token) => {
                      onChange(token)
                      trigger('captchaToken')
                    }}
                  />
                </FormField>
              )}
            />
          )}
        </StyledSignUpForm>
      </FlexBox>
    </FormProvider>
  )
}

const StyledAppLogo = styled(AppLogo)`
  height: 36px;
  width: auto;

  path {
    fill: ${cVar('colorTextMuted')};
  }
`

const StyledSignUpForm = styled.form<{ additionalPaddingBottom?: boolean }>`
  width: 100%;
  display: grid;
  gap: ${sizes(6)};
  padding-bottom: ${({ additionalPaddingBottom }) =>
    additionalPaddingBottom ? 'var(--local-size-dialog-padding)' : 0};
`
