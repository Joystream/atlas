import { DialogButtonProps } from '@/components/_overlays/Dialog'

export type SignInStepProps = {
  setPrimaryButtonProps: (props: DialogButtonProps) => void
  goToNextStep: () => void
  hasNavigatedBack: boolean
}
