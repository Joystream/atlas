import React, { useState } from 'react'

import { Text } from '@/components/Text'
import { VideoMetadata as Metadata, getVideoMetadata } from '@/utils/video'

export const VideoMetaData = () => {
  const [metadata, setmetadata] = useState<Metadata>()
  const [error, seterror] = useState<Error>()
  return (
    <div>
      <input
        type="file"
        accept="video/*,.mkv"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (file) {
            try {
              seterror(undefined)
              const metadata = await getVideoMetadata(file)
              setmetadata(metadata)
            } catch (err) {
              seterror(err)
            }
          }
        }}
      ></input>
      <Text>{error?.message}</Text>
      <h2>Metadata:</h2>
      <p>type: {metadata?.mimeType}</p>
      <p>sizeInBytes: {metadata?.sizeInBytes}</p>
      <p>duration: {metadata?.duration}</p>
      <p>width: {metadata?.width}</p>
      <p>height: {metadata?.height}</p>
    </div>
  )
}
