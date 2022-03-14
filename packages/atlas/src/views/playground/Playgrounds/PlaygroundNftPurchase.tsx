import React from 'react'

import { Button } from '@/components/_buttons/Button'
import { useNftActions } from '@/providers/nftActions'
import { NftPurchaseBottomDrawer } from '@/views/global/NftPurchaseBottomDrawer'

export const PlaygroundNftPurchase: React.FC = () => {
  const { openNftPurchase } = useNftActions()
  return (
    <>
      <Button onClick={() => openNftPurchase('1')}>Open auction overlay</Button>
      <NftPurchaseBottomDrawer />
    </>
  )
}
