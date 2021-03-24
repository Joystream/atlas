import React from 'react'
import { StudioContainer } from '@/components'
import { Text } from '@/shared/components'
import AssetsGroupUploadBar from './AssetsGroupUploadBar'
import { StyledText } from './MyUploadsView.style'

const MyUploadsView = () => {
  return (
    <StudioContainer>
      <StyledText variant="h2">My Uploads</StyledText>
      <AssetsGroupUploadBar />
      <AssetsGroupUploadBar />
    </StudioContainer>
  )
}

export default MyUploadsView
