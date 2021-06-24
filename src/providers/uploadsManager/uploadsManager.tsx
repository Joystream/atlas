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
import { UploadManagerValue } from './types'

import { useSnackbar, useUser } from '..'

const UploadManagerContext = React.createContext<UploadManagerValue | undefined>(undefined)
UploadManagerContext.displayName = 'UploadManagerContext'

export const UploadManagerProvider: React.FC = ({ children }) => {
  const navigate = useNavigate()
  const { activeChannelId } = useUser()

  const { displaySnackbar } = useSnackbar()
  const channelUploadsState = useUploadsStore(
    (state) => state.uploadsState.filter((asset) => asset.owner === activeChannelId),
    (prevState, newState) => isEqual(prevState, newState)
  )
  const addAsset = useUploadsStore((state) => state.addAsset)
  const updateAsset = useUploadsStore((state) => state.updateAsset)
  const removeAsset = useUploadsStore((state) => state.removeAsset)

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

      channelUploadsState.forEach((asset) => {
        if (asset.owner !== activeChannelId) {
          return
        }

        if (asset.parentObject.type === 'video') {
          const video = videosLookup.find((video) => asset.parentObject.id === video.id)
          if (
            !video ||
            (video?.mediaAvailability !== AssetAvailability.Pending &&
              video?.mediaDataObject?.joystreamContentId === asset.contentId) ||
            (video?.thumbnailPhotoAvailability !== AssetAvailability.Pending &&
              video?.thumbnailPhotoDataObject?.joystreamContentId === asset.contentId)
          ) {
            removeAsset(asset.contentId)
          }
        }
        if (
          (channel?.avatarPhotoAvailability !== AssetAvailability.Pending &&
            channel?.avatarPhotoDataObject?.joystreamContentId === asset.contentId) ||
          (channel?.coverPhotoAvailability !== AssetAvailability.Pending &&
            channel?.coverPhotoDataObject?.joystreamContentId === asset.contentId)
        ) {
          removeAsset(asset.contentId)
        }
      })

      let notificationsCount = 0

      videosLookup.forEach((video) => {
        if (video.mediaAvailability === AssetAvailability.Pending && video.mediaDataObject?.joystreamContentId) {
          !channelUploadsState.some((asset) => asset.contentId === video.mediaDataObject?.joystreamContentId)
            ? addAsset({
                contentId: video.mediaDataObject?.joystreamContentId,
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
            : updateAsset(video.mediaDataObject.joystreamContentId, 'missing')
          notificationsCount++
        }
        if (
          video.thumbnailPhotoAvailability === AssetAvailability.Pending &&
          video.thumbnailPhotoDataObject?.joystreamContentId
        ) {
          !channelUploadsState.some((asset) => asset.contentId === video.thumbnailPhotoDataObject?.joystreamContentId)
            ? addAsset({
                contentId: video.thumbnailPhotoDataObject.joystreamContentId,
                ipfsContentId: video.thumbnailPhotoDataObject?.ipfsContentId,
                parentObject: {
                  type: 'video',
                  id: video.id,
                },
                owner: activeChannelId,
                type: 'thumbnail',
                lastStatus: 'missing',
                size: video.thumbnailPhotoDataObject?.size ?? 0,
              })
            : updateAsset(video.thumbnailPhotoDataObject.joystreamContentId, 'missing')
          notificationsCount++
        }
      })

      if (notificationsCount > 0) {
        displaySnackbar({
          title: `(${notificationsCount}) Asset${notificationsCount > 1 ? 's' : ''} waiting to resume upload`,
          description: 'Reconnect files to fix the issue',
          actionText: 'See',
          onActionClick: () => navigate(absoluteRoutes.studio.uploads()),
          iconType: 'warning',
        })
      }
      setSyncUpLoading(false)
    }

    init()
  }, [activeChannelId, channelUploadsState, client, displaySnackbar, navigate, updateAsset, removeAsset, addAsset])

  return (
    <UploadManagerContext.Provider
      value={{
        isLoading: syncUpLoading,
        channelUploadsState: channelUploadsState,
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
