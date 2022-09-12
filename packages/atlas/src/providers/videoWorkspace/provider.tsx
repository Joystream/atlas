import { FC, PropsWithChildren, createContext, useCallback, useMemo, useState } from 'react'

import { useCategories } from '@/api/hooks/categories'
import { createId } from '@/utils/createId'
import { SentryLogger } from '@/utils/logs'

import { ContextValue, VideoWorkspace } from './types'

export const VideoWorkspaceContext = createContext<ContextValue | undefined>(undefined)
VideoWorkspaceContext.displayName = 'VideoWorkspaceContext'

const generateVideo = () => ({
  id: createId(),
  isDraft: true,
  isNew: true,
  mintNft: false,
})

export const VideoWorkspaceProvider: FC<PropsWithChildren> = ({ children }) => {
  const [editedVideoInfo, setEditedVideoInfo] = useState<VideoWorkspace>(generateVideo())
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false)
  const setEditedVideo = useCallback((video?: VideoWorkspace) => {
    setEditedVideoInfo(!video ? generateVideo() : video)
  }, [])

  // trigger categories fetch so that they are available once the video workspace is opened
  useCategories(undefined, {
    context: { delay: 1500 },
    onError: (error) => SentryLogger.error('Failed to fetch video categories', 'VideoWorkspaceProvider', error),
  })

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
