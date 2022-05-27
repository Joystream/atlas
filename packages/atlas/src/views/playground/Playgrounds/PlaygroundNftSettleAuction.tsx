import { useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import { TextField } from '@/components/_inputs/TextField'
import { useNftActions } from '@/providers/nftActions'

export const PlaygroundNftSettleAuction = () => {
  const { openNftSettlement } = useNftActions()
  const [nftId, setNftId] = useState('')

  return (
    <>
      <TextField value={nftId} onChange={(e) => setNftId(e.currentTarget.value)} label="Video ID" />
      {nftId && <Button onClick={() => openNftSettlement(nftId)}>Open drawer</Button>}
    </>
  )
}
