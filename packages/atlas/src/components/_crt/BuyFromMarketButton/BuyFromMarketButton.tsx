import { useState } from 'react'

import { ProtectedActionWrapper } from '@/components/_auth/ProtectedActionWrapper'
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
      <ProtectedActionWrapper title="You want to buy tokens?" description="Sign in to buy">
        <Button size="large" fullWidth onClick={() => setShowModal(true)}>
          Buy
        </Button>
      </ProtectedActionWrapper>
    </>
  )
}
