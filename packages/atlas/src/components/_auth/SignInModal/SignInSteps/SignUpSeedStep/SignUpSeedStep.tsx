import { mnemonicGenerate } from '@polkadot/util-crypto'
import { Controller, useForm } from 'react-hook-form'

import { SvgActionCopy } from '@/assets/icons'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { FormField } from '@/components/_inputs/FormField'
import { useClipboard } from '@/hooks/useClipboard'

import { StyledTextArea, StyledTextButton } from './SignupSeedStep.styles'

import { SignInModalStepTemplate } from '../SignInModalStepTemplate'
import { CheckboxWrapper, StyledSignUpForm } from '../SignInSteps.styles'

export const SignUpSeedStep = () => {
  const { copyToClipboard } = useClipboard()
  const { control } = useForm<{ confirmedCopy: boolean }>({
    defaultValues: {
      confirmedCopy: false,
    },
  })
  const seed = mnemonicGenerate()

  return (
    <SignInModalStepTemplate
      title="Write down your seed"
      hasNavigatedBack={false}
      subtitle="Please write down your password recovery seed and keep it in a safe place. It's the only way to recover your password if you forget it."
    >
      <StyledSignUpForm>
        <FormField label="Password recovery seed">
          <StyledTextArea value={seed} disabled />
        </FormField>
        <StyledTextButton
          variant="secondary"
          icon={<SvgActionCopy />}
          iconPlacement="left"
          onClick={() => copyToClipboard(seed, 'Seed copied to your clipboard')}
        >
          Copy to clipboard
        </StyledTextButton>
        <Controller
          control={control}
          name="confirmedCopy"
          render={({ field: { onChange, value } }) => (
            <CheckboxWrapper isAccepted={value}>
              <Checkbox onChange={(val) => onChange(val)} value={value} label="I have saved my mnemonic seed safely" />
            </CheckboxWrapper>
          )}
        />
      </StyledSignUpForm>
    </SignInModalStepTemplate>
  )
}
