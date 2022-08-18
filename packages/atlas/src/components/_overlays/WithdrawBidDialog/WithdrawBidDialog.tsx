import BN from 'bn.js'
import { Dispatch, FC, SetStateAction } from 'react'

import { Fee } from '@/components/Fee'
import { NumberFormat } from '@/components/NumberFormat'
import { AlertDialogModal } from '@/components/_overlays/AlertDialogModal'
import { MemberId, VideoId } from '@/joystream-lib'
import { useFee } from '@/providers/joystream'
import { formatDateTime } from '@/utils/time'

export type WithdrawData = { bid: BN; createdAt: Date } | undefined

type WithdrawBidDialogProps = {
  isOpen: boolean
  onModalClose: () => void
  userBidAmount: BN
  userBidCreatedAt: Date
  nftId: VideoId | null
  memberId: MemberId | null
  onWithdrawBid: (nftId: string) => void
  setWithdrawData: Dispatch<SetStateAction<WithdrawData>>
}

export const WithdrawBidDialog: FC<WithdrawBidDialogProps> = ({
  isOpen,
  onModalClose,
  userBidAmount,
  userBidCreatedAt,
  nftId,
  memberId,
  onWithdrawBid,
  setWithdrawData,
}) => {
  const { loading, fullFee } = useFee('cancelNftBidTx', nftId && memberId ? [nftId, memberId] : undefined)
  return (
    <AlertDialogModal
      show={isOpen}
      onExitClick={onModalClose}
      title={
        <>
          Withdraw your <NumberFormat value={userBidAmount} as="span" withToken /> bid?
        </>
      }
      description={
        <>
          Are you sure you want to withdraw your{' '}
          <NumberFormat value={userBidAmount} as="span" color="colorText" withToken /> bid placed on{' '}
          {formatDateTime(userBidCreatedAt)}?
        </>
      }
      additionalActionsNode={<Fee loading={loading} variant="h200" amount={fullFee || new BN(0)} />}
      primaryButton={{
        text: 'Withdraw',
        onClick: () => {
          if (!nftId) {
            return
          }
          onWithdrawBid(nftId)
          onModalClose()
          setWithdrawData(undefined)
        },
      }}
      secondaryButton={{
        text: 'Cancel',
        onClick: () => {
          onModalClose()
          setWithdrawData(undefined)
        },
      }}
    />
  )
}
