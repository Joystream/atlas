export enum ForgotPasswordStep {
  EmailAndSeedStep = 'EmailAndSeedStep',
  NewPasswordStep = 'NewPasswordStep',
  LoadingStep = 'LoadingStep',
}

export type ForgotPasswordModalForm = {
  [ForgotPasswordStep.EmailAndSeedStep]: {
    mnemonic: string
    email: string
  }
  [ForgotPasswordStep.NewPasswordStep]: {
    password: string
    confirmPassword: string
  }
}
