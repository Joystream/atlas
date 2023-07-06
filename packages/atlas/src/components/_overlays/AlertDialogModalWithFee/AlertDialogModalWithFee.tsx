import BN from 'bn.js'
import { FC } from 'react'

import { Fee } from '@/components/Fee'
import { AlertDialogModal, AlertDialogModalProps } from '@/components/_overlays/AlertDialogModal'
import { useHasEnoughBalance } from '@/hooks/useHasEnoughBalance'
import { JoystreamLibExtrinsics } from '@/joystream-lib/extrinsics'
import { TxMethodName } from '@/joystream-lib/types'
import { useFee } from '@/providers/joystream'

type AlertDialogModalWithFeeProps = AlertDialogModalProps & {
  fee: {
    methodName: TxMethodName
    args?: Parameters<JoystreamLibExtrinsics[TxMethodName]>
  }
}

export const AlertDialogModalWithFee: FC<AlertDialogModalWithFeeProps> = ({ fee, ...args }) => {
  const { fullFee, loading: feeLoading } = useFee(fee.methodName, fee.args && args.show ? fee.args : undefined)
  const { loadingState, signTransactionHandler } = useHasEnoughBalance(feeLoading, fullFee, args.primaryButton?.onClick)

  return (
    <AlertDialogModal
      {...args}
      primaryButton={
        args.primaryButton && {
          ...args.primaryButton,
          text: loadingState ? 'Please wait...' : args.primaryButton.text,
          disabled: loadingState,
          onClick: signTransactionHandler,
        }
      }
      additionalActionsNode={<Fee loading={feeLoading} variant="h200" amount={fullFee || new BN(0)} />}
    />
  )
}
