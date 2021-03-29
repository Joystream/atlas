import React, { useState, useEffect } from 'react'
import { StudioContainer } from '@/components'
import { Text } from '@/shared/components'
import { placeholderItems } from './PlaceholderItems'
import { AssetsGroupUploadBar, UploadData } from './AssetsGroupUploadBar'
import { StyledText } from './MyUploadsView.style'

const uploadingFiles = [
  {
    type: 'channel',
    files: [
      {
        id: '768dad7c-6fea-4496-ae90-3a1ee4281bd4',
        type: 'avatar',
        progress: 0,
        width: 360,
        height: 420,
        size: 178400,
        status: 'reconnecting',
      },
      {
        id: '0c2672ff-8d19-43df-975f-5c089aed5dde',
        type: 'cover',
        progress: 100,
        width: 1300,
        height: 230,
        size: 500400,
        status: 'completed',
      },
    ],
  },
  {
    type: 'video',
    title: 'Lost in the Woods? EP2',
    files: [
      {
        id: 'd6d7be77-a908-412f-9a9d-e6664d11f596',
        type: 'thumbnail',
        progress: 100,
        width: 1920,
        height: 1080,
        size: 378400,
        status: 'completed',
      },
      {
        id: 'eae3c720-de6c-4434-82ef-02629f052074',
        type: 'video',
        progress: 60,
        width: 1920,
        height: 1080,
        size: 1735993000,
        status: 'uploading',
      },
    ],
  },
  {
    type: 'channel',
    files: [
      {
        id: 'd6d7be77-a908-412f-9a9d-e6664d11f596',
        type: 'cover',
        progress: 80,
        width: 1920,
        height: 1080,
        size: 378400,
        status: 'uploading',
      },
      {
        id: 'eae3c720-de6c-4434-82ef-02629f052074',
        type: 'avatar',
        progress: 60,
        width: 500,
        height: 600,
        size: 173565,
        status: 'uploading',
      },
    ],
  },
  {
    type: 'video',
    title: 'Lost in the Woods? EP3',
    files: [
      {
        id: 'e7627036-bfa4-4fa4-bf49-8f6f688ea7b7',
        type: 'thumbnail',
        progress: 0,
        width: 1920,
        height: 1080,
        size: 478400,
        status: 'pending',
      },
      {
        id: 'f93c9f18-32e4-4e5e-8076-92a90bd5d2b2',
        type: 'video',
        progress: 0,
        width: 1920,
        height: 1080,
        size: 3735993000,
        status: 'pending',
      },
    ],
  },
] as UploadData[]

const MyUploadsView = () => {
  // To be removed, faking loading state
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700)
    return () => {
      clearTimeout(timer)
    }
  }, [])

  const hasUploads = uploadingFiles.length > 0

  return (
    <StudioContainer>
      <StyledText variant="h2">My Uploads</StyledText>
      {loading ? (
        placeholderItems.map((Placeholder, idx) => <Placeholder key={`placeholder-${idx}`} />)
      ) : hasUploads ? (
        uploadingFiles.map((files, idx) => <AssetsGroupUploadBar key={files.type + idx} uploadData={files} />)
      ) : (
        <Text variant="h3">No uploads...</Text>
      )}
    </StudioContainer>
  )
}

export default MyUploadsView
