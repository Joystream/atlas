import { FormField } from '@/components/_inputs/FormField'
import { TextArea } from '@/components/_inputs/TextArea'

import { SignInModalStepTemplate } from './SignInModalStepTemplate'

export const SignUpSeedStep = () => {
  return (
    <SignInModalStepTemplate
      title="Write down your seed"
      hasNavigatedBack={false}
      subtitle="Please write down your password recovery seed and keep it in a safe place. It’s the only way to recover your password if you forget it."
    >
      <div>
        <FormField label="Password recovery seed">
          <TextArea
            disabled
            value="village endorse congress whale fruit robot wrist figure junior page language window"
          />
        </FormField>
      </div>
    </SignInModalStepTemplate>
  )
}
