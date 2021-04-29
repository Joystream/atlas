import React, { useEffect } from 'react'
import { useAuthorizedUser, useUploadsManager } from '@/hooks'
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
  const { activeChannelId } = useAuthorizedUser()
  const { uploadsState } = useUploadsManager(activeChannelId)
  const { channel, loading: channelLoading } = useChannel(activeChannelId)
  const { videos, loading: videosLoading } = useVideos(
    {
      where: {
        id_in: uploadsState.filter((item) => item.parentObject.type === 'video').map((item) => item.parentObject.id),
      },
    },
    { skip: !uploadsState.length }
  )

  const channelDataObjects = [channel?.avatarPhotoDataObject, channel?.coverPhotoDataObject]
  const videosDataObjects = videos?.flatMap((video) => [video.mediaDataObject, video.thumbnailPhotoDataObject]) || []
  const allDataObjects = [...channelDataObjects, ...videosDataObjects]

  // Enriching data with pending/accepted/rejected status
  const uploadsStateWithLiaisonJudgement = uploadsState.map((asset) => {
    const dataObject = allDataObjects.find((dataObject) => dataObject?.joystreamContentId === asset.contentId)
    if (dataObject) {
      return { ...asset, liaisonJudgement: dataObject.liaisonJudgement }
    }
    return { ...asset }
  })

  // Enriching video type assets with video title
  const uploadsStateWithVideoTitles = uploadsStateWithLiaisonJudgement.map((asset) => {
    if (asset.type === 'video') {
      const video = videos?.find((video) => video.mediaDataObject?.joystreamContentId === asset.contentId)
      return { ...asset, title: video?.title }
    }
    return asset
  })

  // Grouping all assets by parent id (videos, channel)
  const uploadsStateGroupedByParentObjectId = Object.values(
    uploadsStateWithVideoTitles.reduce((acc: GroupByParentObjectIdAcc, asset) => {
      const key = asset.parentObject.id
      !acc[key] ? (acc[key] = [{ ...asset }]) : acc[key].push(asset)
      return acc
    }, {})
  )

  const hasUploads = uploadsStateGroupedByParentObjectId.length > 0

  return (
    <StudioContainer>
      <StyledText variant="h2">My uploads</StyledText>
      {videosLoading || channelLoading ? (
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
