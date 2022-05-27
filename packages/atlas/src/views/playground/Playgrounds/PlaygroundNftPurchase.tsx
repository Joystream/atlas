import { FC, useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import { TextField } from '@/components/_inputs/TextField'
import { useNftActions } from '@/providers/nftActions'

export const PlaygroundNftPurchase: FC = () => {
  const { openNftPurchase } = useNftActions()

  const [nftId, setNftId] = useState('')

  return (
    <>
      <TextField value={nftId} onChange={(e) => setNftId(e.currentTarget.value)} label="Video ID" />
      {nftId && <Button onClick={() => openNftPurchase(nftId)}>Open drawer</Button>}
    </>
  )
}
