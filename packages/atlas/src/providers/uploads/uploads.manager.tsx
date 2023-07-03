import { useApolloClient } from '@apollo/client'
import { FC, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import shallow from 'zustand/shallow'

import { useDataObjectsAvailabilityLazy } from '@/api/hooks/dataObject'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { fetchMissingAssets } from '@/providers/uploads/uploads.utils'
import { useUser } from '@/providers/user/user.hooks'
import { AssetUploadStatus } from '@/types/storage'
import { openInNewTab } from '@/utils/browser'
import { createLookup } from '@/utils/data'

import { useUploadsStore } from './uploads.store'
import { AssetUpload } from './uploads.types'

import { useSnackbar } from '../snackbars'

type VideoAssets = AssetUpload & { uploadStatus?: AssetUploadStatus }

const UPLOADED_SNACKBAR_TIMEOUT = 13000

export const UploadsManager: FC = () => {
  const navigate = useNavigate()
  const { channelId } = useUser()
  const [cachedChannelId, setCachedChannelId] = useState<string | null>(null)
  const videoAssetsRef = useRef<VideoAssets[]>([])
  const { trackVideoUpload } = useSegmentAnalytics()

  const { displaySnackbar } = useSnackbar()
  const { assetsFiles, channelUploads, uploadStatuses, isSyncing, processingAssets, newChannelsIds } = useUploadsStore(
    (state) => ({
      channelUploads: state.uploads.filter((asset) => asset.owner === channelId),
      isSyncing: state.isSyncing,
      assetsFiles: state.assetsFiles,
      processingAssets: state.processingAssets,
      uploadStatuses: state.uploadsStatus,
      newChannelsIds: state.newChannelsIds,
    }),
    shallow
  )
  const { addAssetToUploads, removeAssetFromUploads, setIsSyncing, removeProcessingAsset, setUploadStatus } =
    useUploadsStore((state) => state.actions)
  const processingAssetsLookup = createLookup(processingAssets.map((asset) => ({ id: asset.id })))

  const videoAssets = channelUploads
    .filter((asset) => asset.type === 'video')
    .map((asset) => ({ ...asset, uploadStatus: uploadStatuses[asset.id]?.lastStatus }))

  const { getDataObjectsAvailability, dataObjects, startPolling, stopPolling } = useDataObjectsAvailabilityLazy({
    fetchPolicy: 'network-only',
    onCompleted: () => {
      startPolling?.(atlasConfig.storage.assetUploadStatusPollingInterval)
    },
  })

  // display snackbar when video upload is complete
  useEffect(() => {
    if (videoAssets.length) {
      videoAssets.forEach((video) => {
        const videoObject = videoAssetsRef.current.find(
          (videoRef) => videoRef.uploadStatus !== 'completed' && videoRef.id === video.id
        )
        if (videoObject && video.uploadStatus === 'completed') {
          displaySnackbar({
            customId: video.id,
            title: 'Video ready to be viewed',
            description: video.parentObject?.title || '',
            iconType: 'success',
            timeout: UPLOADED_SNACKBAR_TIMEOUT,
            actionText: 'See on Joystream',
            onActionClick: () => openInNewTab(absoluteRoutes.viewer.video(video.parentObject.id), true),
          })
          trackVideoUpload(video.parentObject?.title ?? 'no data', channelId ?? 'no data')
        }
      })
      videoAssetsRef.current = videoAssets
    }
  }, [assetsFiles, displaySnackbar, navigate, videoAssets, channelId, trackVideoUpload])

  const initialRender = useRef(true)
  useEffect(() => {
    if (!initialRender.current) {
      return
    }
    processingAssets.map((processingAsset) => {
      setUploadStatus(processingAsset.id, { progress: 100, lastStatus: 'processing' })
    })
    initialRender.current = false
  }, [processingAssets, setUploadStatus])

  useEffect(() => {
    if (!processingAssets.length) {
      return
    }
    getDataObjectsAvailability(processingAssets.map((asset) => asset.id))
  }, [getDataObjectsAvailability, processingAssets])

  useEffect(() => {
    dataObjects?.forEach((asset) => {
      if (asset.isAccepted) {
        setUploadStatus(asset.id, { lastStatus: 'completed' })
        removeProcessingAsset(asset.id)
      }
    })
    if (dataObjects?.every((entry) => entry.isAccepted)) {
      stopPolling?.()
    }
  }, [dataObjects, removeProcessingAsset, setUploadStatus, stopPolling])

  useEffect(() => {
    if (!processingAssets.length) {
      return
    }
    const interval = setInterval(
      () =>
        processingAssets.forEach((processingAsset) => {
          if (processingAsset.expiresAt < Date.now()) {
            removeProcessingAsset(processingAsset.id)
            setUploadStatus(processingAsset.id, { lastStatus: 'error' })
          }
        }),
      5000
    )
    return () => clearInterval(interval)
  }, [processingAssets, processingAssets.length, removeProcessingAsset, setUploadStatus])

  const client = useApolloClient()

  useEffect(() => {
    // do this only on first render or when active channel changes
    if (!channelId || cachedChannelId === channelId || newChannelsIds.includes(channelId) || isSyncing) {
      return
    }

    /*
    We use queueMicrotask to force both state updates to happen at the same time, after other work in the hook is done.
    There is an issue with automatic batching that was introduced in React 18 here -
    without this microtask, even though `setCachedChannelId` and `setIsSyncing` are called at the same time,
    the call to `setCachedChannelId` is somehow ignored and the component re-renders with the old `cachedChannelId` and this hook runs in a forever loop.
    This is somehow related to the `setIsSyncing(false)` call at the end of the `init` function. If you comment it out, state updates properly.
    This is most likely bug in React batching itself, but I wasn't able to make a reproducible example to report an issue.
    */
    queueMicrotask(() => {
      setCachedChannelId(channelId)
      setIsSyncing(true)
    })

    const init = async () => {
      const [fetchedVideos, fetchedChannel, pendingAssetsLookup] = await fetchMissingAssets(client, channelId)

      // start with assumption that all assets are missing
      const missingLocalAssetsLookup = { ...pendingAssetsLookup }

      // remove assets from local state that weren't returned by the query node
      // mark asset as not missing in local state
      channelUploads.forEach((asset) => {
        if (asset.owner !== channelId) {
          return
        }

        if (!missingLocalAssetsLookup[asset.id] && !uploadStatuses[asset.id]) {
          removeAssetFromUploads(asset.id)
        } else {
          // mark asset as not missing from local state
          delete missingLocalAssetsLookup[asset.id]
        }
      })

      // add missing video assets
      fetchedVideos.forEach((video) => {
        const media = video.media
        const thumbnail = video.thumbnailPhoto

        if (media && missingLocalAssetsLookup[media.id]) {
          addAssetToUploads({
            id: media.id,
            ipfsHash: media.ipfsHash,
            parentObject: {
              type: 'video',
              id: video.id,
              ytVideoId: video.ytVideoId,
            },
            owner: channelId,
            type: 'video',
            size: media.size,
          })
        }

        if (thumbnail && missingLocalAssetsLookup[thumbnail.id]) {
          addAssetToUploads({
            id: thumbnail.id,
            ipfsHash: thumbnail.ipfsHash,
            parentObject: {
              type: 'video',
              id: video.id,
              ytVideoId: video.ytVideoId,
            },
            owner: channelId,
            type: 'thumbnail',
            size: thumbnail.size,
          })
        }
      })

      // add missing channel assets
      const avatar = fetchedChannel?.avatarPhoto
      const cover = fetchedChannel?.coverPhoto

      if (avatar && missingLocalAssetsLookup[avatar.id]) {
        addAssetToUploads({
          id: avatar.id,
          ipfsHash: avatar.ipfsHash,
          parentObject: {
            type: 'channel',
            id: fetchedChannel?.id || '',
          },
          owner: channelId,
          type: 'avatar',
          size: avatar.size,
        })
      }
      if (cover && missingLocalAssetsLookup[cover.id]) {
        addAssetToUploads({
          id: cover.id,
          ipfsHash: cover.ipfsHash,
          parentObject: {
            type: 'channel',
            id: fetchedChannel?.id || '',
          },
          owner: channelId,
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
    channelId,
    channelUploads,
    client,
    displaySnackbar,
    navigate,
    removeAssetFromUploads,
    addAssetToUploads,
    cachedChannelId,
    isSyncing,
    setIsSyncing,
    processingAssets,
    processingAssetsLookup,
    newChannelsIds,
    uploadStatuses,
  ])

  return null
}
