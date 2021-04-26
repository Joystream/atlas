import React from 'react'
import { useActiveUser, useUploadsManager } from '@/hooks'
import { useChannel, useVideos } from '@/api/hooks'
import { AssetUploadWithProgress } from '@/hooks/useUploadsManager/types'
import { StudioContainer } from '@/components'
import { EmptyUploadsView } from './EmptyUploadsView'
import { placeholderItems } from './PlaceholderItems'
import { AssetsGroupUploadBar } from './AssetsGroupUploadBar'
import { StyledText } from './MyUploadsView.style'

type GroupByParentObjectIdAcc = {
  [key: string]: AssetUploadWithProgress[]
}

const MyUploadsView = () => {
  const { activeUser } = useActiveUser()
  const channelId = activeUser.channelId ?? ''
  const { uploadsState } = useUploadsManager(channelId)
  const { channel, loading: channelLoading } = useChannel(channelId)
  const { videos, loading: videosLoading } = useVideos({
    where: {
      channelId_eq: channelId,
    },
  })

  const channelDataObjects = [channel?.avatarPhotoDataObject, channel?.coverPhotoDataObject]
  const videosDataObjects =
    videos?.map((video) => [{ title: video.title, ...video.mediaDataObject }, video.thumbnailPhotoDataObject]).flat() ||
    []
  const allDataObjects = [...channelDataObjects, ...videosDataObjects]

  // Enriching data with pending/accepted/rejected status
  const uploadsStateWithLiaisonJudgement = uploadsState.map((asset) => {
    const dataObject = allDataObjects.find((dataObject) => dataObject?.joystreamContentId === asset.contentId)
    if (dataObject) {
      return { ...asset, liaisonJudgement: dataObject.liaisonJudgement, progress: asset.progress * 100 }
    }
    return { ...asset, progress: asset.progress * 100 }
  })

  // Grouping all assets by parent id (videos, channel)
  const uploadsStateGroupedByParentObjectId = Object.values(
    uploadsStateWithLiaisonJudgement.reduce((acc: GroupByParentObjectIdAcc, asset) => {
      const key = asset.parentObject.id
      !acc[key] ? (acc[key] = [{ ...asset }]) : acc[key].push(asset)
      return acc
    }, {})
  )

  const hasUploads = uploadsStateGroupedByParentObjectId.length > 0

  return (
    <StudioContainer>
      <StyledText variant="h2">My Uploads</StyledText>
      {videosLoading || channelLoading || !uploadsState.length ? (
        placeholderItems.map((Placeholder, idx) => <Placeholder key={`placeholder-${idx}`} />)
      ) : hasUploads ? (
        uploadsStateGroupedByParentObjectId.map((files) => (
          <AssetsGroupUploadBar key={files[0].parentObject.id} uploadData={files} />
        ))
      ) : (
        <EmptyUploadsView />
      )}
    </StudioContainer>
  )
}

export default MyUploadsView
