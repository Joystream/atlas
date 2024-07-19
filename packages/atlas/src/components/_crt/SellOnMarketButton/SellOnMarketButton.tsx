import { useState } from 'react'

import { ProtectedActionWrapper } from '@/components/_auth/ProtectedActionWrapper'
import { Button } from '@/components/_buttons/Button'
import { SellTokenModal } from '@/components/_crt/SellTokenModal'

type SellOnMarketButtonProps = {
  tokenId: string
  isTokenLocked?: boolean
}

export const SellOnMarketButton = ({ tokenId, isTokenLocked }: SellOnMarketButtonProps) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      <SellTokenModal tokenId={tokenId} show={showModal} onClose={() => setShowModal(false)} />
      <ProtectedActionWrapper title="You want to sell tokens?" description="Sign in to sell">
        <Button
          variant={isTokenLocked ? 'warning-secondary' : 'secondary'}
          fullWidth
          size="large"
          onClick={() => setShowModal(true)}
        >
          Sell
        </Button>
      </ProtectedActionWrapper>
    </>
  )
}
