import { FC, useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { useNftActions } from '@/providers/nftActions/nftActions.hooks'

export const PlaygroundNftPurchase: FC = () => {
  const { openNftPurchase } = useNftActions()

  const [nftId, setNftId] = useState('')

  return (
    <>
      <FormField label="Video ID">
        <Input value={nftId} onChange={(e) => setNftId(e.currentTarget.value)} />
      </FormField>
      {nftId && <Button onClick={() => openNftPurchase(nftId)}>Open drawer</Button>}
    </>
  )
}
