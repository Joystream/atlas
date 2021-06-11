import React from 'react'

import { useAuthorizedUser, useUploadsManager } from '@/hooks'

import { AssetsGroupUploadBar } from './AssetsGroupUploadBar'
import { AssetGroupUploadBarPlaceholder } from './AssetsGroupUploadBar/AssetGroupUploadBarPlaceholder'
import { EmptyUploadsView } from './EmptyUploadsView'
import { StyledText, UploadsContainer } from './MyUploadsView.style'

const MyUploadsView: React.FC = () => {
  const { activeChannelId } = useAuthorizedUser()
  const { uploadsState, isLoading } = useUploadsManager(activeChannelId)

  const hasUploads = uploadsState.length > 0

  const placeholderItems = Array.from({ length: 5 }).map((_, idx) => <AssetGroupUploadBarPlaceholder key={idx} />)

  return (
    <UploadsContainer>
      <StyledText variant="h2">My uploads</StyledText>
      {isLoading ? (
        placeholderItems
      ) : hasUploads ? (
        uploadsState.map((files) => <AssetsGroupUploadBar key={files[0].parentObject.id} uploadData={files} />)
      ) : (
        <EmptyUploadsView />
      )}
    </UploadsContainer>
  )
}

export default MyUploadsView
