import React, { useState, useEffect } from 'react'
import { StudioContainer } from '@/components'
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
        progress: 70,
        dimension: '1920x1080',
        size: 1735993000,
        status: 'uploading',
      },
    ],
  },
] as UploadData[]

const MyUploadsView = () => {
  return (
    <StudioContainer>
      <StyledText variant="h2">My Uploads</StyledText>
      {uploadedFiles.map((files, idx) => (
        <AssetsGroupUploadBar key={files.type + idx} uploadData={files} />
      ))}
    </StudioContainer>
  )
}

export default MyUploadsView
