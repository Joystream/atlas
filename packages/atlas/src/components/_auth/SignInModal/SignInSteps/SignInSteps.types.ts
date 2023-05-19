import { DialogButtonProps } from '@/components/_overlays/Dialog'

export enum ModalSteps {
  Wallet = 'Wallet',
  Membership = 'Membership',
  Logging = 'Logging',
  Email = 'Email',
  Register = 'Register',
  ExtensionSigning = 'ExtensionSigning',
}

export type SignInStepProps = {
  setPrimaryButtonProps: (props: DialogButtonProps) => void
  goToStep: (step: ModalSteps) => void
  hasNavigatedBack: boolean
}
