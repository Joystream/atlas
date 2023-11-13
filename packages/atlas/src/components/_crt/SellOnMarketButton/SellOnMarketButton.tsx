import { useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import { SellTokenModal } from '@/components/_crt/SellTokenModal'

type SellOnMarketButtonProps = {
  tokenId: string
}

export const SellOnMarketButton = ({ tokenId }: SellOnMarketButtonProps) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      <SellTokenModal tokenId={tokenId} show={showModal} onClose={() => setShowModal(false)} />
      <Button variant="secondary" size="large" onClick={() => setShowModal(true)}>
        Sell
      </Button>
    </>
  )
}
