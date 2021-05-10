import React from 'react'
import { useAuthorizedUser, useUploadsManager } from '@/hooks'
import { StudioContainer } from '@/components'
import { EmptyUploadsView } from './EmptyUploadsView'
import { placeholderItems } from './PlaceholderItems'
import { AssetsGroupUploadBar } from './AssetsGroupUploadBar'
import { StyledText } from './MyUploadsView.style'

const MyUploadsView = () => {
  const { activeChannelId } = useAuthorizedUser()
  const { uploadsState, isLoading } = useUploadsManager(activeChannelId)

  const hasUploads = uploadsState.length > 0

  return (
    <StudioContainer>
      <StyledText variant="h2">My Uploads</StyledText>
      {isLoading ? (
        placeholderItems.map((Placeholder, idx) => <Placeholder key={`placeholder-${idx}`} />)
      ) : hasUploads ? (
        uploadsState.map((files) => <AssetsGroupUploadBar key={files[0].parentObject.id} uploadData={files} />)
      ) : (
        <EmptyUploadsView />
      )}
    </StudioContainer>
  )
}

export default MyUploadsView
