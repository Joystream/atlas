import { useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import { PlaylistWorkspace } from '@/views/studio/PlaylistWorkspace'

export const PlaygroundCustomPLThumbnail = () => {
  const [show, setShow] = useState(true)

  return (
    <>
      <Button onClick={() => setShow(true)}>Show workspace</Button>
      <PlaylistWorkspace show={show} onHide={() => setShow(false)} />
    </>
  )
}
