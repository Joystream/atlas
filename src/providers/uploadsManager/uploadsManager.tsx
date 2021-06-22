import { useApolloClient } from '@apollo/client'
import { isEqual } from 'lodash'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import {
  AssetAvailability,
  GetChannelDocument,
  GetChannelQuery,
  GetChannelQueryVariables,
  GetVideosDocument,
  GetVideosQuery,
  GetVideosQueryVariables,
} from '@/api/queries'
import { absoluteRoutes } from '@/config/routes'
import { createLookup } from '@/utils/data'

import { useUploadsStore } from './store'
import { AssetUpload, UploadManagerValue } from './types'

import { useSnackbar, useUser } from '..'

const UploadManagerContext = React.createContext<UploadManagerValue | undefined>(undefined)
UploadManagerContext.displayName = 'UploadManagerContext'

export const UploadManagerProvider: React.FC = ({ children }) => {
  const navigate = useNavigate()
  const { activeChannelId } = useUser()

  const { displaySnackbar } = useSnackbar()
  const updateAsset = useUploadsStore((state) => state.updateAsset)

  const channelUploadsState = useUploadsStore(
    (state) => state.uploadsState.filter((asset) => asset.owner === activeChannelId),
    (prevState, newState) => isEqual(prevState, newState)
  )

  // \/ workaround for now to not show completed uploads but not delete them since we may want to show history of uploads in the future
  const [ignoredAssetsIds, setIgnoredAssetsIds] = useState<string[]>([])
  const [queryNodePendingAssets, setQueryNodePendingAssets] = useState<AssetUpload[]>([])
  const [syncUpLoading, setSyncUpLoading] = useState(true)

  const client = useApolloClient()

  const isInitialMount = useRef(true)
  useEffect(() => {
    if (!activeChannelId || !isInitialMount.current) {
      return
    }
    isInitialMount.current = false

    const init = async () => {
      const videosMediaPromise = client.query<GetVideosQuery, GetVideosQueryVariables>({
        query: GetVideosDocument,
        variables: { where: { mediaAvailability_eq: AssetAvailability.Pending, channelId_eq: activeChannelId } },
      })

      const videosThumbnailPromise = client.query<GetVideosQuery, GetVideosQueryVariables>({
        query: GetVideosDocument,
        variables: {
          where: { thumbnailPhotoAvailability_eq: AssetAvailability.Pending, channelId_eq: activeChannelId },
        },
      })

      const channelPromise = client.query<GetChannelQuery, GetChannelQueryVariables>({
        query: GetChannelDocument,
        variables: { where: { id: activeChannelId } },
      })

      const [videosMediaResponse, videosThumbnailResponse, channelResponse] = await Promise.all([
        videosMediaPromise,
        videosThumbnailPromise,
        channelPromise,
      ])

      const videosMedia = videosMediaResponse.data.videos
      const videosThumbnail = videosThumbnailResponse.data.videos

      const videosMediaLookup = createLookup(videosMedia || [])
      const videosThumbnailLookup = createLookup(videosThumbnail || [])
      // to remove any duplicates
      const videosLookup = Object.values({
        ...videosMediaLookup,
        ...videosThumbnailLookup,
      })
      const channel = channelResponse.data.channelByUniqueInput

      const pendingAssets = videosLookup.flatMap((video) => {
        const assetsGroup: AssetUpload[] = []
        if (video.mediaAvailability === AssetAvailability.Pending) {
          assetsGroup.push({
            contentId: video.mediaDataObject?.joystreamContentId ?? '',
            ipfsContentId: video.mediaDataObject?.ipfsContentId,
            parentObject: {
              type: 'video',
              id: video.id,
            },
            owner: activeChannelId,
            type: 'video',
            lastStatus: 'missing',
            size: video.mediaDataObject?.size ?? 0,
            dimensions: channelUploadsState.find(
              (asset) => asset.contentId === video.mediaDataObject?.joystreamContentId
            )?.dimensions,
          })
        }
        if (video.thumbnailPhotoAvailability === AssetAvailability.Pending) {
          const localAsset = channelUploadsState.find(
            (asset) => asset.contentId === video.thumbnailPhotoDataObject?.joystreamContentId
          )
          assetsGroup.push({
            contentId: video.thumbnailPhotoDataObject?.joystreamContentId ?? '',
            ipfsContentId: video.thumbnailPhotoDataObject?.ipfsContentId,
            parentObject: {
              type: 'video',
              id: video.id,
            },
            owner: activeChannelId,
            type: 'thumbnail',
            lastStatus: 'missing',
            size: video.thumbnailPhotoDataObject?.size ?? 0,
            imageCropData: localAsset?.imageCropData,
            dimensions: localAsset?.dimensions,
          })
        }
        return assetsGroup
      })

      if (channel?.avatarPhotoAvailability === AssetAvailability.Pending) {
        const localAsset = channelUploadsState.find(
          (asset) => asset.contentId === channel?.avatarPhotoDataObject?.joystreamContentId
        )
        pendingAssets.push({
          contentId: channel?.avatarPhotoDataObject?.joystreamContentId ?? '',
          owner: activeChannelId,
          parentObject: {
            type: 'channel',
            id: activeChannelId,
          },
          type: 'avatar',
          size: channel?.avatarPhotoDataObject?.size ?? 0,
          lastStatus: 'missing',
          imageCropData: localAsset?.imageCropData,
          dimensions: localAsset?.dimensions,
        })
      }
      if (channel?.coverPhotoAvailability === AssetAvailability.Pending) {
        const localAsset = channelUploadsState.find(
          (asset) => asset.contentId === channel?.coverPhotoDataObject?.joystreamContentId
        )
        pendingAssets.push({
          contentId: channel?.coverPhotoDataObject?.joystreamContentId ?? '',
          owner: activeChannelId,
          parentObject: {
            type: 'channel',
            id: activeChannelId,
          },
          type: 'cover',
          size: channel?.coverPhotoDataObject?.size ?? 0,
          lastStatus: 'missing',
          imageCropData: localAsset?.imageCropData,
          dimensions: localAsset?.dimensions,
        })
      }

      channelUploadsState.forEach((asset) => {
        const isPending = pendingAssets.some((item) => item.contentId === asset.contentId)
        if (!isPending && asset.lastStatus !== 'completed') {
          updateAsset(asset.contentId, { lastStatus: 'completed' })
        }
        if (isPending && asset.lastStatus !== 'completed') {
          updateAsset(asset.contentId, { lastStatus: 'missing' })
        } else {
          setIgnoredAssetsIds((ignored) => [...ignored, asset.contentId])
        }
      })

      setQueryNodePendingAssets(pendingAssets)

      if (pendingAssets.length > 0) {
        displaySnackbar({
          title: `(${pendingAssets.length}) Asset${pendingAssets.length > 1 ? 's' : ''} waiting to resume upload`,
          description: 'Reconnect files to fix the issue',
          actionText: 'See',
          onActionClick: () => navigate(absoluteRoutes.studio.uploads()),
          iconType: 'warning',
        })
      }
      setSyncUpLoading(false)
    }

    init()
  }, [activeChannelId, channelUploadsState, client, displaySnackbar, navigate, updateAsset])

  const assetsUpload = [...channelUploadsState, ...queryNodePendingAssets].filter(
    (asset, idx, allAssets) =>
      allAssets.findIndex((item) => item.contentId === asset.contentId) === idx &&
      !ignoredAssetsIds.includes(asset.contentId)
  )

  return (
    <UploadManagerContext.Provider
      value={{
        isLoading: syncUpLoading,
        channelUploadsState: assetsUpload,
      }}
    >
      {children}
    </UploadManagerContext.Provider>
  )
}

export const useUploadsManager = () => {
  const ctx = useContext(UploadManagerContext)
  if (ctx === undefined) {
    throw new Error('useUploadsManager must be used within a UploadManagerProvider')
  }
  return ctx
}
