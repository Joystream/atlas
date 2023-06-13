export enum ForgotPasswordStep {
  EmailAndSeedStep = 'EmailAndSeedStep',
  NewPasswordStep = 'NewPasswordStep',
}

export type ForgotPasswordModalForm = {
  [ForgotPasswordStep.EmailAndSeedStep]: {
    seed: string
    email: string
  }
  [ForgotPasswordStep.NewPasswordStep]: {
    password: string
    confirmPassword: string
  }
}
