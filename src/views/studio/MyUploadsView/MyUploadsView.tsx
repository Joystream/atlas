import React from 'react'

import { useAuthorizedUser, useUploadsManager } from '@/hooks'

import { AssetsGroupUploadBar } from './AssetsGroupUploadBar'
import { EmptyUploadsView } from './EmptyUploadsView'
import { StyledText, UploadsContainer } from './MyUploadsView.style'
import { placeholderItems } from './PlaceholderItems'

const MyUploadsView = () => {
  const { activeChannelId } = useAuthorizedUser()
  const { uploadsState, isLoading } = useUploadsManager(activeChannelId)

  const hasUploads = uploadsState.length > 0

  return (
    <UploadsContainer>
      <StyledText variant="h2">My uploads</StyledText>
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
