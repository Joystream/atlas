import { useState } from 'react'

import { ProtectedActionWrapper } from '@/components/_auth/ProtectedActionWrapper'
import { Button } from '@/components/_buttons/Button'
import { BuyMarketTokenModal } from '@/components/_crt/BuyMarketTokenModal'

type BuyFromMarketButtonProps = {
  tokenId: string
  isTokenLocked?: boolean
}

export const BuyFromMarketButton = ({ tokenId, isTokenLocked }: BuyFromMarketButtonProps) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      <BuyMarketTokenModal tokenId={tokenId} show={showModal} onClose={() => setShowModal(false)} />
      <ProtectedActionWrapper title="You want to buy tokens?" description="Sign in to buy">
        <Button
          variant={isTokenLocked ? 'warning' : 'primary'}
          size="large"
          fullWidth
          onClick={() => setShowModal(true)}
        >
          Buy
        </Button>
      </ProtectedActionWrapper>
    </>
  )
}
