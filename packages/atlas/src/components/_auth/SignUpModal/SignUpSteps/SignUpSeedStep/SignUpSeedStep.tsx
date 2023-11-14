import { mnemonicGenerate } from '@polkadot/util-crypto'
import { FC, useCallback, useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { AuthenticationModalStepTemplate } from '@/components/_auth/AuthenticationModalStepTemplate'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { FormField } from '@/components/_inputs/FormField'
import { MemberFormData } from '@/hooks/useCreateMember'

import { StyledTextArea } from './SignupSeedStep.styles'

import { StyledSignUpForm } from '../SignUpSteps.styles'
import { SignUpStepsCommonProps } from '../SignUpSteps.types'

type FormData = Pick<MemberFormData, 'allowDownload' | 'mnemonic'>

type SignUpSeedStepProps = {
  onSeedSubmit: (mnemonic: string, allowDownload: boolean) => void
} & SignUpStepsCommonProps &
  FormData

export const SignUpSeedStep: FC<SignUpSeedStepProps> = ({
  hasNavigatedBack,
  setPrimaryButtonProps,
  mnemonic,
  onSeedSubmit,
}) => {
  const { control, register, getValues, handleSubmit, setValue } = useForm<FormData>({
    shouldFocusError: true,
    defaultValues: {
      allowDownload: true,
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
    const downloadSeed = () => {
      const blobText = new Blob([getValues('mnemonic')], { type: 'text/plain' })
      const url = URL.createObjectURL(blobText)
      const link = document.createElement('a')
      link.href = url
      link.download = 'mnemonic.txt'
      link.click()

      link.remove()
      URL.revokeObjectURL(url)
    }

    handleSubmit((data) => {
      onSeedSubmit(data.mnemonic, data.allowDownload)
      if (data.allowDownload) {
        downloadSeed()
      }
    })()
  }, [getValues, handleSubmit, onSeedSubmit])

  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Continue',
      onClick: () => handleGoToNextStep(),
    })
  }, [handleGoToNextStep, setPrimaryButtonProps])

  return (
    <AuthenticationModalStepTemplate
      title="Write down your seed"
      hasNavigatedBack={hasNavigatedBack}
      subtitle="Please write down your password recovery seed and keep it in a safe place. It's the only way to recover your password if you forget it."
    >
      <StyledSignUpForm>
        <FormField label="Password recovery seed">
          <StyledTextArea data-ls-disabled {...register('mnemonic')} disabled />
        </FormField>
        <Controller
          control={control}
          name="allowDownload"
          render={({ field: { onChange, value } }) => (
            <Checkbox
              onChange={(val) => onChange(val)}
              value={value}
              label="Download the wallet seed as txt file"
              caption="Download will start after clicking continue"
            />
          )}
        />
      </StyledSignUpForm>
    </AuthenticationModalStepTemplate>
  )
}
