import BN from 'bn.js'
import { FC } from 'react'

import { Fee } from '@/components/Fee'
import { AlertDialogModal } from '@/components/_overlays/AlertDialogModal'
import { NftSaleType } from '@/joystream-lib'
import { useFee } from '@/providers/joystream'

type RemoveFromSaleDialogProps = {
  isOpen: boolean
  onModalClose: () => void
  onRemoveFromSale: (id: string, saleType: NftSaleType) => void
  nftId: string | null
  memberId: string | null
  saleType: NftSaleType | null
}

export const RemoveFromSaleDialog: FC<RemoveFromSaleDialogProps> = ({
  isOpen,
  onRemoveFromSale,
  nftId,
  memberId,
  saleType,
  onModalClose,
}) => {
  const { loading, fullFee } = useFee(
    'cancelNftSaleTx',
    nftId && saleType && memberId ? [nftId, memberId, saleType] : undefined
  )
  return (
    <AlertDialogModal
      show={isOpen}
      type="warning"
      title="Remove from sale?"
      description="Are you sure you want to remove this NFT from sale? You can put it back on sale anytime."
      primaryButton={{
        text: 'Remove',
        onClick: () => {
          if (!nftId || !saleType) {
            return
          }
          onRemoveFromSale(nftId, saleType)
          onModalClose()
        },
      }}
      secondaryButton={{
        text: 'Cancel',
        onClick: onModalClose,
      }}
      additionalActionsNode={<Fee loading={loading} variant="h200" amount={fullFee || new BN(0)} />}
    />
  )
}
