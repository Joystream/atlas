import React from 'react'
import { useAuthorizedUser, useUploadsManager } from '@/hooks'
import { EmptyUploadsView } from './EmptyUploadsView'
import { placeholderItems } from './PlaceholderItems'
import { AssetsGroupUploadBar } from './AssetsGroupUploadBar'
import { StyledText, UploadsContainer } from './MyUploadsView.style'

const MyUploadsView = () => {
  const { uploadsState, isLoading } = useUploadsManager()

  const hasUploads = uploadsState.length > 0
  return (
    <UploadsContainer>
      <StyledText variant="h2">My Uploads</StyledText>
      {isLoading ? (
        placeholderItems.map((Placeholder, idx) => <Placeholder key={`placeholder-${idx}`} />)
      ) : hasUploads ? (
        uploadsState.map((files) => <AssetsGroupUploadBar key={files[0].parentObject.id} uploadData={files} />)
      ) : (
        <EmptyUploadsView />
      )}
    </UploadsContainer>
  )
}

export default MyUploadsView
