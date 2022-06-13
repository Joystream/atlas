import { FC, PropsWithChildren, createContext, useCallback, useMemo, useState } from 'react'

import { createId } from '@/utils/createId'

import { ContextValue, VideoWorkspace } from './types'

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
  const setEditedVideo = useCallback((video?: VideoWorkspace) => {
    setEditedVideoInfo(!video ? generateVideo() : video)
  }, [])

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
