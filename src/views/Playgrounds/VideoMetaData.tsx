import React, { useState } from 'react'
import { Text } from '@/shared/components'
import { getVideoMetadata, VideoMetadata as Metadata } from '@/utils/video'

export const VideoMetadata = () => {
  const [metadata, setmetadata] = useState<Metadata>()
  const [error, seterror] = useState<Error>()
  return (
    <div>
      <input
        type="file"
        accept="video/*"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          const { metadata, error } = await getVideoMetadata(file)
          if (error) {
            seterror(error)
          } else {
            setmetadata(metadata)
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
