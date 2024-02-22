import { DialogButtonProps } from '@/components/_overlays/Dialog'

export enum ChangeNowModalStep {
  INFO,
  FORM,
  SUMMARY,
  PROGRESS,
}

export type TransactionType = 'buy' | 'sell' | 'topup'

export type CommonProps = {
  type: TransactionType
  setPrimaryButtonProps: (props: DialogButtonProps) => void
  goToStep: (step: ChangeNowModalStep) => void
}
