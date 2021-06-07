import React, { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router'
import { useChannel, useVideos } from '@/api/hooks'
import { absoluteRoutes } from '@/config/routes'
import { UploadManagerValue } from './types'
import { LiaisonJudgement } from '@/api/queries'
import { useMST } from '../useStore'
import { IAssetUpload } from '@/models/UploadsManagerStore'
import { useUser } from '..'

type GroupByParentObjectIdAcc = {
  [key: string]: IAssetUpload[]
}

const UploadManagerContext = React.createContext<UploadManagerValue | undefined>(undefined)
UploadManagerContext.displayName = 'UploadManagerContext'

export const UploadManagerProvider = observer(({ children }) => {
  const navigate = useNavigate()
  const { uploadsManagerStore, snackbarStore } = useMST()
  const { activeChannelId } = useUser()
  const { channel, loading: channelLoading } = useChannel(activeChannelId ?? '')
  const { videos, loading: videosLoading } = useVideos(
    {
      where: {
        id_in: uploadsManagerStore.uploadingAssetsState
          .filter((item) => item.parentObject.type === 'video')
          .map((item) => item.parentObject.id),
      },
    },
    { skip: !uploadsManagerStore.uploadingAssetsState.length }
  )

  const channelDataObjects = [channel?.avatarPhotoDataObject, channel?.coverPhotoDataObject]
  const videosDataObjects = videos?.flatMap((video) => [video.mediaDataObject, video.thumbnailPhotoDataObject]) || []
  const allDataObjects = [...channelDataObjects, ...videosDataObjects]

  // Enriching data with pending/accepted/rejected status
  const uploadsStateWithLiaisonJudgement = uploadsManagerStore.uploadingAssetsState
    .map((asset) => {
      const dataObject = allDataObjects.find((dataObject) => dataObject?.joystreamContentId === asset.contentId)
      if (!dataObject && !channelLoading && !videosLoading) {
        return null
      }

      return { ...asset, liaisonJudgement: dataObject?.liaisonJudgement, ipfsContentId: dataObject?.ipfsContentId }
    })
    .filter((asset) => asset !== null)

  const lostConnectionAssets = uploadsStateWithLiaisonJudgement.filter(
    (asset) => asset?.liaisonJudgement === LiaisonJudgement.Pending && asset.lastStatus === 'error'
  )

  useEffect(() => {
    if (!lostConnectionAssets.length) {
      return
    }
    snackbarStore.displaySnackbar(
      {
        title: `(${lostConnectionAssets.length}) Asset${
          lostConnectionAssets.length > 1 ? 's' : ''
        } waiting to resume upload`,
        description: 'Reconnect files to fix the issue',
        actionText: 'See',
        iconType: 'warning',
      },
      () => navigate(absoluteRoutes.studio.uploads())
    )
  }, [lostConnectionAssets.length, navigate, snackbarStore])

  // Enriching video type assets with video title
  const uploadsStateWithVideoTitles = uploadsStateWithLiaisonJudgement.map((asset) => {
    if (asset?.type === 'video') {
      const video = videos?.find((video) => video.mediaDataObject?.joystreamContentId === asset.contentId)
      const title = video?.title ?? null
      return { ...asset, title }
    }
    return asset
  })

  // Check if liaison data and video title is available
  uploadsStateWithVideoTitles.map((asset) => {
    if (!channelLoading && !videosLoading && (!asset?.liaisonJudgement || !asset?.ipfsContentId)) {
      console.warn(`Asset does not contain liaisonJudgement. ContentId: ${asset?.contentId}`)
    }
    if (!channelLoading && !videosLoading && asset?.type === 'video' && !asset?.title) {
      console.warn(`Video type asset does not contain title. ContentId: ${asset.contentId}`)
    }
  })

  // Grouping all assets by parent id (videos, channel)
  const uploadsStateGroupedByParentObjectId = Object.values(
    uploadsStateWithVideoTitles.reduce((acc: GroupByParentObjectIdAcc, asset) => {
      if (!asset) {
        return acc
      }
      const key = asset.parentObject.id
      !acc[key] ? (acc[key] = [{ ...asset }]) : acc[key].push(asset)
      return acc
    }, {})
  )

  const isLoading = channelLoading || videosLoading

  return (
    <UploadManagerContext.Provider
      value={{
        startFileUpload: uploadsManagerStore.startFileUpload,
        isLoading,
        uploadsState: uploadsStateGroupedByParentObjectId,
      }}
    >
      {children}
    </UploadManagerContext.Provider>
  )
})

const useUploadsManagerContext = () => {
  const ctx = useContext(UploadManagerContext)
  if (ctx === undefined) {
    throw new Error('useUploadsManager must be used within a UploadManagerProvider')
  }
  return ctx
}

export const useUploadsManager = () => {
  const { uploadsState, ...rest } = useUploadsManagerContext()
  return {
    uploadsState,
    ...rest,
  }
}
