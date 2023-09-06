import { mnemonicGenerate } from '@polkadot/util-crypto'
import { FC, useCallback, useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { SvgActionCopy } from '@/assets/icons'
import { AuthenticationModalStepTemplate } from '@/components/_auth/AuthenticationModalStepTemplate'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { FormField } from '@/components/_inputs/FormField'
import { useClipboard } from '@/hooks/useClipboard'
import { MemberFormData } from '@/hooks/useCreateMember'

import { StyledTextArea, StyledTextButton } from './SignupSeedStep.styles'

import { CheckboxWrapper, StyledSignUpForm } from '../SignUpSteps.styles'
import { SignUpStepsCommonProps } from '../SignUpSteps.types'

type FormData = Pick<MemberFormData, 'confirmedCopy' | 'mnemonic'>

type SignUpSeedStepProps = {
  onSeedSubmit: (mnemonic: string, confirmedCopy: boolean) => void
} & SignUpStepsCommonProps &
  FormData

export const SignUpSeedStep: FC<SignUpSeedStepProps> = ({
  hasNavigatedBack,
  setPrimaryButtonProps,
  mnemonic,
  confirmedCopy,
  onSeedSubmit,
}) => {
  const { copyToClipboard } = useClipboard()
  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    shouldFocusError: true,
    defaultValues: {
      confirmedCopy: confirmedCopy,
      mnemonic,
    },
  })
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current && !mnemonic) {
      setValue('mnemonic', mnemonicGenerate())
      firstRender.current = false
    }
  }, [mnemonic, setValue])

  const handleGoToNextStep = useCallback(() => {
    handleSubmit((data) => {
      onSeedSubmit(data.mnemonic, data.confirmedCopy)
    })()
  }, [handleSubmit, onSeedSubmit])

  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Continue',
      onClick: () => handleGoToNextStep(),
    })
  }, [handleGoToNextStep, setPrimaryButtonProps])

  return (
    <AuthenticationModalStepTemplate
      hasNegativeBottomMargin
      title="Write down your seed"
      hasNavigatedBack={hasNavigatedBack}
      subtitle="Please write down your password recovery seed and keep it in a safe place. It's the only way to recover your password if you forget it."
    >
      <StyledSignUpForm>
        <FormField label="Password recovery seed">
          <StyledTextArea data-ls-disabled {...register('mnemonic')} disabled />
        </FormField>
        <StyledTextButton
          variant="secondary"
          icon={<SvgActionCopy />}
          iconPlacement="left"
          onClick={() => copyToClipboard(getValues('mnemonic'), 'Seed copied to your clipboard')}
        >
          Copy to clipboard
        </StyledTextButton>
        <Controller
          control={control}
          name="confirmedCopy"
          rules={{
            validate: {
              valid: (value) => {
                if (!value) {
                  return 'Agree that you saved your wallet seed phrase safely.'
                } else {
                  return value
                }
              },
            },
          }}
          render={({ field: { onChange, value } }) => (
            <CheckboxWrapper isAccepted={value}>
              <Checkbox
                onChange={(val) => onChange(val)}
                caption={errors.confirmedCopy?.message}
                error={!!errors.confirmedCopy}
                value={value}
                label="I have saved my wallet seed phrase safely"
              />
            </CheckboxWrapper>
          )}
        />
      </StyledSignUpForm>
    </AuthenticationModalStepTemplate>
  )
}
