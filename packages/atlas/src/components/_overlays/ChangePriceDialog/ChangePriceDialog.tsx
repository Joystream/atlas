import styled from '@emotion/styled'
import React, { useState } from 'react'

import { Pill } from '@/components/Pill'
import { JoyTokenIcon } from '@/components/_icons/JoyTokenIcon'
import { TextField } from '@/components/_inputs/TextField'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useTokenPrice } from '@/providers/joystream'
import { sizes } from '@/styles'

type ChangePriceDialogProps = {
  onModalClose: () => void
  isOpen: boolean
  onChangePrice: (id: string, price: number) => void
  nftId: string | null
}

export const ChangePriceDialog: React.FC<ChangePriceDialogProps> = ({ onModalClose, isOpen, onChangePrice, nftId }) => {
  const [price, setPrice] = useState<number | null>(null)
  const { convertToUSD } = useTokenPrice()

  const handleSubmitPriceChange = () => {
    if (!nftId || !price) {
      return
    }
    setPrice(null)
    onModalClose()
    onChangePrice(nftId, price)
  }

  return (
    <DialogModal
      title="Change price"
      description="Change price for your existing item. New price must be lower than the current one. If you want to rise the price up, you have to remove this item from sale and then start a new sale."
      show={isOpen}
      dividers
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
      <StyledTextField
        type="text"
        onChange={(event) => setPrice(Number(event.target.value))}
        nodeStart={<JoyTokenIcon size={24} variant="silver" />}
        nodeEnd={<Pill label={convertToUSD(price ?? 0)} />}
      />
    </DialogModal>
  )
}

export const StyledTextField = styled(TextField)`
  margin-top: ${sizes(6)};
`
