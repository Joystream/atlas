import { DialogButtonProps } from '@/components/_overlays/Dialog'

export enum ChangeNowModalStep {
  INFO,
  FORM,
  SUMMARY,
  PROGRESS,
  SWAP_EXPIRED,
  TIMEOUT,
  FAILED,
}

export type TransactionType = 'buy' | 'sell' | 'topup'

export type CommonProps = {
  type: TransactionType
  setPrimaryButtonProps: (props: DialogButtonProps) => void
  onClose: () => void
  goToStep: (step: ChangeNowModalStep) => void
}
