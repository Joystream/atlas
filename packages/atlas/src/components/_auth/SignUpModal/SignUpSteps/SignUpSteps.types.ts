import { DialogButtonProps } from '@/components/_overlays/Dialog'

export type SignUpStepsCommonProps = {
  setPrimaryButtonProps: (props: DialogButtonProps) => void
  goToNextStep: () => void
  hasNavigatedBack: boolean
}
