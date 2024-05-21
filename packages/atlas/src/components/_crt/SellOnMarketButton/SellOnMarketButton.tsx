import { useState } from 'react'

import { ProtectedActionWrapper } from '@/components/_auth/ProtectedActionWrapper'
import { Button } from '@/components/_buttons/Button'
import { SellTokenModal } from '@/components/_crt/SellTokenModal'

type SellOnMarketButtonProps = {
  tokenId: string
  hasActiveRevenueShare?: boolean
}

export const SellOnMarketButton = ({ tokenId, hasActiveRevenueShare }: SellOnMarketButtonProps) => {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      <SellTokenModal tokenId={tokenId} show={showModal} onClose={() => setShowModal(false)} />
      <ProtectedActionWrapper title="You want to sell tokens?" description="Sign in to sell">
        <Button
          variant={hasActiveRevenueShare ? 'warning-secondary' : 'secondary'}
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
