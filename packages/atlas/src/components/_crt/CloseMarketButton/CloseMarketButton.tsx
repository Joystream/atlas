import { useState } from 'react'

import { SvgActionNotForSale } from '@/assets/icons'
import { Button } from '@/components/_buttons/Button'
import { CloseMarketModal } from '@/components/_crt/CloseMarketModal'

type CloseMarketButtonProps = {
  disabled?: boolean
  channelId: string
  tokenId: string
  fullWidth?: boolean
}

export const CloseMarketButton = ({ channelId, disabled, fullWidth, tokenId }: CloseMarketButtonProps) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      <Button
        icon={<SvgActionNotForSale />}
        variant="secondary"
        disabled={disabled}
        onClick={() => setShowModal(true)}
        fullWidth={fullWidth}
      >
        Close market
      </Button>
      <CloseMarketModal show={showModal} tokenId={tokenId} channelId={channelId} onClose={() => setShowModal(false)} />
    </>
  )
}
