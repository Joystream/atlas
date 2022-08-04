import styled from '@emotion/styled'
import BN from 'bn.js'
import { FC, useState } from 'react'

import { Text } from '@/components/Text'
import { TokenInput } from '@/components/_inputs/TokenInput'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { tokenNumberToHapiBn } from '@/joystream-lib/utils'
import { sizes } from '@/styles'

type ChangePriceDialogProps = {
  onModalClose: () => void
  isOpen: boolean
  onChangePrice: (id: string, price: BN) => void
  nftId: string | null
}

export const ChangePriceDialog: FC<ChangePriceDialogProps> = ({ onModalClose, isOpen, onChangePrice, nftId }) => {
  const [price, setPrice] = useState<number | null>()

  const handleSubmitPriceChange = () => {
    if (!nftId || !price) {
      return
    }
    setPrice(null)
    onModalClose()
    onChangePrice(nftId, tokenNumberToHapiBn(price))
  }

  return (
    <DialogModal
      title="Change price"
      show={isOpen}
      primaryButton={{
        text: 'Change price',
        disabled: !price,
        onClick: handleSubmitPriceChange,
      }}
      secondaryButton={{
        text: 'Cancel',
        onClick: onModalClose,
      }}
    >
      <>
        <Text as="p" variant="t200" color="colorText">
          You can update the price of this NFT anytime.
        </Text>
        <StyledTokenInput value={price} onChange={(value) => setPrice(value)} />
      </>
    </DialogModal>
  )
}

export const StyledTokenInput = styled(TokenInput)`
  margin-top: ${sizes(6)};
`
