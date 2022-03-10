import React from 'react'

import { Button } from '@/components/_buttons/Button'
import { useNftPurchase } from '@/providers/nftPurchase'
import { NftPurchaseView } from '@/views/viewer/NftPurchaseView'

export const NftPurchase: React.FC = () => {
  const { setIsNftPurchaseOpen } = useNftPurchase()
  return (
    <>
      <Button onClick={() => setIsNftPurchaseOpen(true)}>Open auction overlay</Button>
      <NftPurchaseView />
    </>
  )
}
