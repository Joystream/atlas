import { useState } from 'react'

import { VideoPicker } from '@/components/_crt/VideoPicker'

export const PlaygroundVideoPicker = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  return <VideoPicker selectedVideo={selectedVideo} setSelectedVideo={setSelectedVideo} />
}
