import { useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import { BuyMarketTokenModal } from '@/components/_crt/BuyMarketTokenModal'

type BuyFromMarketButtonProps = {
  tokenId: string
}

export const BuyFromMarketButton = ({ tokenId }: BuyFromMarketButtonProps) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      <BuyMarketTokenModal tokenId={tokenId} show={showModal} onClose={() => setShowModal(false)} />
      <Button size="large" onClick={() => setShowModal(true)}>
        Buy
      </Button>
    </>
  )
}
