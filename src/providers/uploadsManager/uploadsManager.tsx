import { useApolloClient } from '@apollo/client'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import shallow from 'zustand/shallow'

import { useDataObjectsAvailabilityLazy } from '@/api/hooks'
import { ASSET_POLLING_INTERVAL } from '@/config/assets'
import { absoluteRoutes } from '@/config/routes'
import { fetchMissingAssets } from '@/providers/uploadsManager/utils'
import { SvgGlyphExternal } from '@/shared/icons'
import { AssetUploadStatus } from '@/types/uploads'
import { openInNewTab } from '@/utils/browser'
import { createLookup } from '@/utils/data'

import { useUploadsStore } from './store'
import { AssetUpload } from './types'

import { useSnackbar } from '../snackbars'
import { useUser } from '../user'

type VideoAssets = AssetUpload & { uploadStatus?: AssetUploadStatus }

const UPLOADED_SNACKBAR_TIMEOUT = 13000

export const UploadsManager: React.FC = () => {
  const navigate = useNavigate()
  const { activeChannelId } = useUser()
  const [cachedActiveChannelId, setCachedActiveChannelId] = useState<string | null>(null)
  const videoAssetsRef = useRef<VideoAssets[]>([])

  const { displaySnackbar } = useSnackbar()
  const { assetsFiles, channelUploads, uploadStatuses, isSyncing, processingAssetsIds } = useUploadsStore(
    (state) => ({
      channelUploads: state.uploads.filter((asset) => asset.owner === activeChannelId),
      isSyncing: state.isSyncing,
      assetsFiles: state.assetsFiles,
      processingAssetsIds: state.processingAssetsIds,
      uploadStatuses: state.uploadsStatus,
    }),
    shallow
  )
  const { addAssetToUploads, removeAssetFromUploads, setIsSyncing, removeProcessingAssetId, setUploadStatus } =
    useUploadsStore((state) => state.actions)
  const processingAssetsLookup = createLookup(processingAssetsIds.map((id) => ({ id })))

  const videoAssets = channelUploads
    .filter((asset) => asset.type === 'video')
    .map((asset) => ({ ...asset, uploadStatus: uploadStatuses[asset.contentId]?.lastStatus }))

  const { getDataObjectsAvailability, dataObjects, startPolling, stopPolling } = useDataObjectsAvailabilityLazy({
    fetchPolicy: 'network-only',
    onCompleted: () => {
      startPolling?.(ASSET_POLLING_INTERVAL)
    },
  })

  // display snackbar when video upload is complete
  useEffect(() => {
    if (videoAssets.length) {
      videoAssets.forEach((video) => {
        const videoObject = videoAssetsRef.current.find(
          (videoRef) => videoRef.uploadStatus !== 'completed' && videoRef.contentId === video.contentId
        )
        if (videoObject && video.uploadStatus === 'completed') {
          displaySnackbar({
            customId: video.contentId,
            title: 'Video ready to be viewed',
            description: video.parentObject?.title || '',
            iconType: 'success',
            timeout: UPLOADED_SNACKBAR_TIMEOUT,
            actionText: 'See on Joystream',
            actionIcon: <SvgGlyphExternal />,
            onActionClick: () => openInNewTab(absoluteRoutes.viewer.video(video.parentObject.id), true),
          })
        }
      })
      videoAssetsRef.current = videoAssets
    }
  }, [assetsFiles, displaySnackbar, navigate, videoAssets])

  const initialRender = useRef(true)
  useEffect(() => {
    if (!initialRender.current) {
      return
    }
    processingAssetsIds.map((assetId) => {
      setUploadStatus(assetId, { progress: 100, lastStatus: 'processing' })
    })
    initialRender.current = false
  }, [processingAssetsIds, setUploadStatus])

  useEffect(() => {
    if (!processingAssetsIds.length) {
      return
    }
    getDataObjectsAvailability(processingAssetsIds)
  }, [getDataObjectsAvailability, processingAssetsIds])

  useEffect(() => {
    dataObjects?.forEach((asset) => {
      if (asset.liaisonJudgement === 'ACCEPTED') {
        setUploadStatus(asset.joystreamContentId, { lastStatus: 'completed' })
        removeProcessingAssetId(asset.joystreamContentId)
      }
    })
    if (dataObjects?.every((entry) => entry.liaisonJudgement === 'ACCEPTED')) {
      stopPolling?.()
    }
  }, [dataObjects, removeProcessingAssetId, setUploadStatus, stopPolling])

  const client = useApolloClient()

  useEffect(() => {
    // do this only on first render or when active channel changes
    if (!activeChannelId || cachedActiveChannelId === activeChannelId || isSyncing) {
      return
    }
    setCachedActiveChannelId(activeChannelId)
    setIsSyncing(true)

    const init = async () => {
      const [fetchedVideos, fetchedChannel, pendingAssetsLookup] = await fetchMissingAssets(client, activeChannelId)

      // start with assumption that all assets are missing
      const missingLocalAssetsLookup = { ...pendingAssetsLookup }

      // remove assets from local state that weren't returned by the query node
      // mark asset as not missing in local state
      channelUploads.forEach((asset) => {
        if (asset.owner !== activeChannelId) {
          return
        }

        if (!pendingAssetsLookup[asset.contentId]) {
          removeAssetFromUploads(asset.contentId)
        } else {
          // mark asset as not missing from local state
          delete missingLocalAssetsLookup[asset.contentId]
        }
      })

      // add missing video assets
      fetchedVideos.forEach((video) => {
        const media = video.mediaDataObject
        const thumbnail = video.thumbnailPhotoDataObject

        if (media && missingLocalAssetsLookup[media.joystreamContentId]) {
          addAssetToUploads({
            contentId: media.joystreamContentId,
            ipfsContentId: media.ipfsContentId,
            parentObject: {
              type: 'video',
              id: video.id,
            },
            owner: activeChannelId,
            type: 'video',
            size: media.size,
          })
        }

        if (thumbnail && missingLocalAssetsLookup[thumbnail.joystreamContentId]) {
          addAssetToUploads({
            contentId: thumbnail.joystreamContentId,
            ipfsContentId: thumbnail.ipfsContentId,
            parentObject: {
              type: 'video',
              id: video.id,
            },
            owner: activeChannelId,
            type: 'thumbnail',
            size: thumbnail.size,
          })
        }
      })

      // add missing channel assets
      const avatar = fetchedChannel?.avatarPhotoDataObject
      const cover = fetchedChannel?.coverPhotoDataObject

      if (avatar && missingLocalAssetsLookup[avatar.joystreamContentId]) {
        addAssetToUploads({
          contentId: avatar.joystreamContentId,
          ipfsContentId: avatar.ipfsContentId,
          parentObject: {
            type: 'channel',
            id: fetchedChannel?.id || '',
          },
          owner: activeChannelId,
          type: 'avatar',
          size: avatar.size,
        })
      }
      if (cover && missingLocalAssetsLookup[cover.joystreamContentId]) {
        addAssetToUploads({
          contentId: cover.joystreamContentId,
          ipfsContentId: cover.ipfsContentId,
          parentObject: {
            type: 'channel',
            id: fetchedChannel?.id || '',
          },
          owner: activeChannelId,
          type: 'cover',
          size: cover.size,
        })
      }

      const missingAssetsNotificationCount = Object.keys(pendingAssetsLookup).filter(
        (key) => !processingAssetsLookup[key]
      ).length

      if (missingAssetsNotificationCount > 0) {
        displaySnackbar({
          title: `${missingAssetsNotificationCount} asset${
            missingAssetsNotificationCount > 1 ? 's' : ''
          } waiting to resume upload`,
          description: 'Reconnect files to fix the issue',
          actionText: 'See',
          onActionClick: () => navigate(absoluteRoutes.studio.uploads(), { state: { highlightFailed: true } }),
          iconType: 'warning',
        })
      }
      setIsSyncing(false)
    }

    init()
  }, [
    activeChannelId,
    channelUploads,
    client,
    displaySnackbar,
    navigate,
    removeAssetFromUploads,
    addAssetToUploads,
    cachedActiveChannelId,
    isSyncing,
    setIsSyncing,
    processingAssetsIds,
    processingAssetsLookup,
  ])

  return null
}
