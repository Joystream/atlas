import React, { useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import { NftSettlementBottomDrawer } from '@/views/viewer/NftSettlementBottomDrawer/NftSettlementBottomDrawer'

export const SettlingAuction = () => {
  const [drawerOpen, setIsDrawerOpen] = useState(true)
  return (
    <>
      <Button onClick={() => setIsDrawerOpen(true)}>Open drawer</Button>
      <NftSettlementBottomDrawer isOpen={drawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  )
}
