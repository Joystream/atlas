import React from 'react'

import { useUploadsManager } from '@/providers'

import { AssetsGroupUploadBar } from './AssetsGroupUploadBar'
import { AssetGroupUploadBarPlaceholder } from './AssetsGroupUploadBar/AssetGroupUploadBarPlaceholder'
import { EmptyUploadsView } from './EmptyUploadsView'
import { StyledText, UploadsContainer } from './MyUploadsView.style'

export const MyUploadsView: React.FC = () => {
  const { uploadsState, isLoading } = useUploadsManager()

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
