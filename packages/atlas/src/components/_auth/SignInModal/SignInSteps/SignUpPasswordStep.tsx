import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'

import { SignInModalStepTemplate } from './SignInModalStepTemplate'

export const SignUpPasswordStep = () => {
  return (
    <SignInModalStepTemplate
      title="Sign up"
      hasNavigatedBack={false}
      subtitle="Please note that there is no option for us to recover your password if you forget it."
    >
      <div>
        <FormField>
          <Input type="password" placeholder="Password" />
        </FormField>
        <FormField>
          <Input type="password" placeholder="Repeat password" />
        </FormField>
      </div>
    </SignInModalStepTemplate>
  )
}
