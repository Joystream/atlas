import { FC, PropsWithChildren, createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { createId } from '@/utils/createId'

import { ContextValue, VideoWorkspace } from './types'

import { useOverlayManager } from '../overlayManager'

export const VideoWorkspaceContext = createContext<ContextValue | undefined>(undefined)
VideoWorkspaceContext.displayName = 'VideoWorkspaceContext'

const generateVideo = () => ({
  id: createId(),
  isDraft: true,
  isNew: true,
  mintNft: false,
})

export const VideoWorkspaceProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const [editedVideoInfo, setEditedVideoInfo] = useState<VideoWorkspace>(generateVideo())
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false)
  const [cachedIsWorkspaceOpen, setCachedIsWorkspaceOpen] = useState(false)
  const { incrementOverlaysOpenCount, decrementOverlaysOpenCount } = useOverlayManager()
  const setEditedVideo = useCallback((video?: VideoWorkspace) => {
    setEditedVideoInfo(!video ? generateVideo() : video)
  }, [])

  // manage overlays counts when workspace opens/closes
  useEffect(() => {
    if (isWorkspaceOpen === cachedIsWorkspaceOpen) {
      return
    }
    setCachedIsWorkspaceOpen(isWorkspaceOpen)

    if (isWorkspaceOpen) {
      incrementOverlaysOpenCount()
    } else {
      decrementOverlaysOpenCount()
    }
  }, [isWorkspaceOpen, cachedIsWorkspaceOpen, incrementOverlaysOpenCount, decrementOverlaysOpenCount])

  const value = useMemo(
    () => ({
      editedVideoInfo,
      setEditedVideo,
      isWorkspaceOpen,
      setIsWorkspaceOpen,
    }),
    [editedVideoInfo, setEditedVideo, isWorkspaceOpen]
  )

  return <VideoWorkspaceContext.Provider value={value}>{children}</VideoWorkspaceContext.Provider>
}
