import React, { useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import { TextField } from '@/components/_inputs/TextField'
import { NftSettlementBottomDrawer } from '@/views/viewer/NftSettlementBottomDrawer/NftSettlementBottomDrawer'

export const SettlingAuction = () => {
  const [drawerOpen, setIsDrawerOpen] = useState(false)
  const [nftId, setNftId] = useState('')

  return (
    <>
      <TextField value={nftId} onChange={(e) => setNftId(e.currentTarget.value)} label="Video ID" />
      <br />
      <br />
      {nftId && (
        <>
          <Button onClick={() => setIsDrawerOpen(true)}>Open drawer</Button>
          <NftSettlementBottomDrawer isOpen={drawerOpen} onClose={() => setIsDrawerOpen(false)} nftId={nftId} />
        </>
      )}
    </>
  )
}
