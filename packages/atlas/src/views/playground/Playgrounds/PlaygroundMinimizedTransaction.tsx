import React, { useRef, useState } from 'react'

import { useVideosConnection } from '@/api/hooks'
import { Grid } from '@/components/Grid'
import { Button } from '@/components/_buttons/Button'
import { SvgActionChevronR } from '@/components/_icons'
import { TextField } from '@/components/_inputs/TextField'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useAuthorizedUser } from '@/providers/user'

export const PlaygroundMinimizedTransaction = () => {
  const [editMode, setEditMode] = useState('')
  const { activeChannelId, activeMemberId } = useAuthorizedUser()
  const handleTransaction = useTransaction()
  const { joystream, proxyCallback } = useJoystream()
  const inputRef = useRef<HTMLInputElement>(null)

  const { edges, refetch } = useVideosConnection({
    where: {
      channel: {
        id_eq: activeChannelId,
      },
      nft: {
        id_eq: null,
      },
    },
  })

  const updateVideoName = async (id: string) => {
    if (!joystream) {
      return
    }
    const title = inputRef?.current?.value
    await handleTransaction({
      minimized: {
        signMessage: 'To leave your comment you need to sign the transaction in Polkadot extension.',
        signErrorMessage: `Your comment to the video ${title} has not been posted.`,
      },
      txFactory: async (updateStatus) =>
        (
          await joystream.extrinsics
        ).updateVideo(
          id,
          activeMemberId,
          {
            title,
            nft: undefined,
          },
          undefined,
          {},
          proxyCallback(updateStatus)
        ),
      onTxSync: () => refetch(),
    })
  }

  return (
    <Grid>
      {edges?.map(({ node: { id, title } }) => (
        <div key={id}>
          <VideoTileViewer id={id} />
          <div style={{ display: 'flex', marginTop: '16px' }}>
            {editMode === id ? (
              <>
                <TextField defaultValue={title ?? ''} ref={inputRef} />
                <Button onClick={() => updateVideoName(id)} iconOnly icon={<SvgActionChevronR />} />
              </>
            ) : (
              <Button fullWidth onClick={() => setEditMode(id)}>
                Edit name
              </Button>
            )}
          </div>
        </div>
      ))}
    </Grid>
  )
}
