import { FC, PropsWithChildren, createContext, useCallback, useMemo, useState } from 'react'

import { absoluteRoutes } from '@/config/routes'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { createId } from '@/utils/createId'

import { ContextValue, VideoWorkspace } from './types'

import { useUser } from '../user/user.hooks'

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
  const { trackUploadVideoClicked } = useSegmentAnalytics()

  const { activeChannel } = useUser()

  const handleOpenVideoWorkspace = useCallback(() => {
    trackUploadVideoClicked(activeChannel?.id)
    setEditedVideo()
  }, [activeChannel?.id, setEditedVideo, trackUploadVideoClicked])

  const value = useMemo(
    () => ({
      editedVideoInfo,
      setEditedVideo,
      isWorkspaceOpen,
      setIsWorkspaceOpen,
      uploadVideoButtonProps: {
        to: absoluteRoutes.studio.videoWorkspace(),
        onClick: handleOpenVideoWorkspace,
      },
    }),
    [editedVideoInfo, setEditedVideo, isWorkspaceOpen, handleOpenVideoWorkspace]
  )

  return <VideoWorkspaceContext.Provider value={value}>{children}</VideoWorkspaceContext.Provider>
}
