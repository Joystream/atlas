import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { createId } from '@/utils/createId'

import {
  ContextValue,
  VideoWorkspace,
  VideoWorkspaceAssets,
  VideoWorkspaceAssetsCache,
  VideoWorkspaceState,
} from './types'

import { useOverlayManager } from '../overlayManager'

export const VideoWorkspaceContext = React.createContext<ContextValue | undefined>(undefined)
VideoWorkspaceContext.displayName = 'VideoWorkspaceContext'

const generateVideo = () => ({
  id: createId(),
  isDraft: true,
  isNew: true,
})

export const VideoWorkspaceProvider: React.FC = ({ children }) => {
  const [editedVideoInfo, setEditedVideoInfo] = useState<VideoWorkspace>(generateVideo())
  const [assetsCache, setAssetsCache] = useState<VideoWorkspaceAssetsCache>(null)
  const [videoWorkspaceState, setVideoWorkspaceState] = useState<VideoWorkspaceState>('closed')
  const [cachedVideoWorkspaceState, setCachedVideoWorkspaceState] = useState<VideoWorkspaceState>('closed')
  const { incrementOverlaysOpenCount, decrementOverlaysOpenCount } = useOverlayManager()
  const setEditedVideo = useCallback((video?: VideoWorkspace) => {
    setEditedVideoInfo(!video ? generateVideo() : video)
  }, [])

  const setVideoCachedAssets = useCallback(
    (assets: VideoWorkspaceAssets | null) => {
      if (!editedVideoInfo) {
        return
      }
      setAssetsCache(assets)
    },
    [editedVideoInfo]
  )
  const videoCachedAssets = assetsCache

  useEffect(() => {
    if (videoWorkspaceState === cachedVideoWorkspaceState) {
      return
    }
    setCachedVideoWorkspaceState(videoWorkspaceState)

    if (videoWorkspaceState === 'open') {
      incrementOverlaysOpenCount()
    }
    if (videoWorkspaceState === 'closed') {
      decrementOverlaysOpenCount()
    }
  }, [
    videoWorkspaceState,
    cachedVideoWorkspaceState,
    editedVideoInfo,
    incrementOverlaysOpenCount,
    decrementOverlaysOpenCount,
    setEditedVideo,
  ])

  const value = useMemo(
    () => ({
      editedVideoInfo,
      setEditedVideo,
      videoWorkspaceState,
      setVideoWorkspaceState,
      videoCachedAssets,
      setVideoCachedAssets,
    }),
    [editedVideoInfo, setEditedVideo, videoWorkspaceState, videoCachedAssets, setVideoCachedAssets]
  )

  return <VideoWorkspaceContext.Provider value={value}>{children}</VideoWorkspaceContext.Provider>
}
