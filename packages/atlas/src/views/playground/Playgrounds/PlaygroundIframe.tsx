import { useState } from 'react'

import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'

export const PlaygroundIframe = () => {
  const [id, setVideoId] = useState('1')
  return (
    <div>
      <FormField label="Video id">
        <Input value={id} onChange={(e) => setVideoId(e.currentTarget.value)} />
      </FormField>
      <iframe
        src={`${window.location.origin}/embedded/video/${id}`}
        scrolling="no"
        height="400px"
        width="600px"
        allowFullScreen
      />
    </div>
  )
}
