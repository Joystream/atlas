import { useState } from 'react'

import { SvgActionNotForSale } from '@/assets/icons'
import { Button } from '@/components/_buttons/Button'
import { CloseMarketModal } from '@/components/_crt/CloseMarketModal'

type CloseMarketButtonProps = {
  disabled?: boolean
  channelId: string
  fullWidth?: boolean
}

export const CloseMarketButton = ({ channelId, disabled, fullWidth }: CloseMarketButtonProps) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      <Button
        icon={<SvgActionNotForSale />}
        variant="destructive-secondary"
        disabled={disabled}
        onClick={() => setShowModal(true)}
        fullWidth={fullWidth}
      >
        Close market
      </Button>
      <CloseMarketModal show={showModal} channelId={channelId} onClose={() => setShowModal(false)} />
    </>
  )
}
