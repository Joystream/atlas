import React from 'react'

import { Button } from '@/components/_buttons/Button'
import { useAuction } from '@/providers/auction/hooks'
import { AuctionView } from '@/views/viewer/AuctionView'

export const Auction: React.FC = () => {
  const { setAuctionOpen } = useAuction()
  return (
    <>
      <Button onClick={() => setAuctionOpen(true)}>Open auction overlay</Button>
      <AuctionView />
    </>
  )
}
