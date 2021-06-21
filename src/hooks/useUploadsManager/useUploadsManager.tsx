import { isEqual } from 'lodash'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import shallow from 'zustand/shallow'

import { useChannel, useVideos } from '@/api/hooks'
import { absoluteRoutes } from '@/config/routes'
import { useUser } from '@/hooks'

import { useUploadsStore } from './store'
import { UploadManagerValue } from './types'

import { useSnackbar } from '../useSnackbar'

const UploadManagerContext = React.createContext<UploadManagerValue | undefined>(undefined)
UploadManagerContext.displayName = 'UploadManagerContext'

export const UploadManagerProvider: React.FC = ({ children }) => {
  const navigate = useNavigate()
  const { activeChannelId } = useUser()

  const { displaySnackbar } = useSnackbar()
  const updateAsset = useUploadsStore((state) => state.updateAsset)

  const uploadsStateIds = useUploadsStore(
    (state) =>
      state.uploadsState.filter((item) => item.parentObject?.type === 'video').map((item) => item.parentObject.id),
    shallow
  )
  const channelUploadsState = useUploadsStore(
    (state) => state.uploadsState.filter((asset) => asset.owner === activeChannelId),
    (prevState, newState) => isEqual(prevState, newState)
  )
  // \/ workaround for now to not show completed uploads but not delete them since we may want to show history of uploads in the future
  const [ignoredAssetsIds, setIgnoredAssetsIds] = useState<string[]>([])
  const { loading: channelLoading } = useChannel(activeChannelId ?? '')
  const { loading: videosLoading } = useVideos(
    {
      where: {
        id_in: uploadsStateIds,
      },
    },
    { skip: !uploadsStateIds.length }
  )

  const isInitialMount = useRef(true)
  useEffect(() => {
    if (!isInitialMount.current) {
      return
    }
    isInitialMount.current = false

    let missingAssetsCount = 0
    channelUploadsState.forEach((asset) => {
      if (asset.lastStatus !== 'completed') {
        updateAsset(asset.contentId, 'missing')
        missingAssetsCount++
      } else {
        setIgnoredAssetsIds((ignored) => [...ignored, asset.contentId])
      }
    })

    if (missingAssetsCount > 0) {
      displaySnackbar({
        title: `(${missingAssetsCount}) Asset${missingAssetsCount > 1 ? 's' : ''} waiting to resume upload`,
        description: 'Reconnect files to fix the issue',
        actionText: 'See',
        onActionClick: () => navigate(absoluteRoutes.studio.uploads()),
        iconType: 'warning',
      })
    }
  }, [channelUploadsState, displaySnackbar, navigate, updateAsset])

  const isLoading = channelLoading || videosLoading

  return (
    <UploadManagerContext.Provider
      value={{
        isLoading,
        channelUploadsState: channelUploadsState.filter((asset) => !ignoredAssetsIds.includes(asset.contentId)),
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
