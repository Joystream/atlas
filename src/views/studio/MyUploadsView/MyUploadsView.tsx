import React, { useState, useEffect } from 'react'
import { StudioContainer } from '@/components'
import PlaceholderItems from './PlaceholderItems'
import AssetsGroupUploadBar, { UploadData } from './AssetsGroupUploadBar'
import { StyledText } from './MyUploadsView.style'

const uploadedFiles = [
  {
    type: 'channel',
    files: [
      {
        type: 'avatar',
        progress: 0,
        dimension: '360x420',
        size: 178400,
        status: 'failed',
        statusMessage: 'Trying to reconnect',
      },
    ],
  },
  {
    type: 'video',
    title: 'Lost in the Woods? EP2',
    files: [
      {
        type: 'thumbnail',
        progress: 100,
        dimension: '1920x1080',
        size: 378400,
        status: 'completed',
      },
      {
        type: 'video',
        progress: 60,
        dimension: '1920x1080',
        size: 1735993000,
        status: 'uploading',
      },
    ],
  },
  {
    type: 'video',
    title: 'Lost in the Woods? EP3',
    files: [
      {
        type: 'thumbnail',
        progress: 0,
        dimension: '1920x1080',
        size: 478400,
        status: 'pending',
      },
      {
        type: 'video',
        progress: 0,
        dimension: '1920x1080',
        size: 3735993000,
        status: 'pending',
      },
    ],
  },
] as UploadData[]

const MyUploadsView = () => {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700)
    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <StudioContainer>
      <StyledText variant="h2">My Uploads</StyledText>
      {loading ? (
        <PlaceholderItems />
      ) : (
        uploadedFiles.map((files, idx) => <AssetsGroupUploadBar key={files.type + idx} uploadData={files} />)
      )}
    </StudioContainer>
  )
}

export default MyUploadsView
