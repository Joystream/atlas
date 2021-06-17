import React from 'react'

import { useUploadsManager } from '@/hooks'
import { AssetUploadWithProgress, useUploadsStore } from '@/hooks/useUploadsManager'

import { AssetsGroupUploadBar } from './AssetsGroupUploadBar'
import { AssetGroupUploadBarPlaceholder } from './AssetsGroupUploadBar/AssetGroupUploadBarPlaceholder'
import { EmptyUploadsView } from './EmptyUploadsView'
import { StyledText, UploadsContainer } from './MyUploadsView.style'

type GroupByParentObjectIdAcc = {
  [key: string]: AssetUploadWithProgress[]
}

export const MyUploadsView: React.FC = () => {
  const { isLoading } = useUploadsManager()
  const uploadsProgress = useUploadsStore((state) => state.uploadsProgress)
  const { chanelUploadsState } = useUploadsManager()

  const filteredUploadStateWithProgress = chanelUploadsState.map((asset) => ({
    ...asset,
    progress: uploadsProgress[asset.contentId] ?? 0,
  }))

  // Grouping all assets by parent id (videos, channel)
  const groupedUploadsState = Object.values(
    filteredUploadStateWithProgress.reduce((acc: GroupByParentObjectIdAcc, asset) => {
      if (!asset) {
        return acc
      }
      const key = asset.parentObject.id
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(asset)
      return acc
    }, {})
  )

  const hasUploads = groupedUploadsState.length > 0
  const placeholderItems = Array.from({ length: 5 }).map((_, idx) => <AssetGroupUploadBarPlaceholder key={idx} />)

  return (
    <UploadsContainer>
      <StyledText variant="h2">My uploads</StyledText>
      {isLoading ? (
        placeholderItems
      ) : hasUploads ? (
        groupedUploadsState.map((files) => <AssetsGroupUploadBar key={files[0].parentObject.id} uploadData={files} />)
      ) : (
        <EmptyUploadsView />
      )}
    </UploadsContainer>
  )
}
