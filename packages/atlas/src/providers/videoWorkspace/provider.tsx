import { FC, PropsWithChildren, createContext, useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { ContentTypeDialog } from '@/components/_overlays/ContentTypeDialog'
import { atlasConfig } from '@/config'
import { absoluteRoutes } from '@/config/routes'
import { createId } from '@/utils/createId'

import { ContextValue, VideoWorkspace } from './types'

import { usePersonalDataStore } from '../personalData'
import { useUser } from '../user/user.hooks'

export const VideoWorkspaceContext = createContext<ContextValue | undefined>(undefined)
VideoWorkspaceContext.displayName = 'VideoWorkspaceContext'

const generateVideo = () => ({
  id: createId(),
  isDraft: true,
  isNew: true,
  mintNft: false,
})

const CONTENT_TYPE_INFO = 'content-type'

export const VideoWorkspaceProvider: FC<PropsWithChildren> = ({ children }) => {
  const [editedVideoInfo, setEditedVideoInfo] = useState<VideoWorkspace>(generateVideo())
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false)
  const setEditedVideo = useCallback((video?: VideoWorkspace) => {
    setEditedVideoInfo(!video ? generateVideo() : video)
  }, [])
  const navigate = useNavigate()

  const { activeChannel } = useUser()

  const isContentTypeInfoDismissed = usePersonalDataStore((state) =>
    atlasConfig.general.appContentFocus
      ? state.dismissedMessages.some((message) => message.id === CONTENT_TYPE_INFO) ||
        (activeChannel?.totalVideosCreated && activeChannel?.totalVideosCreated > 0)
      : true
  )
  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)

  const [isContentTypeDialogOpen, setIsContentDialogOpen] = useState(false)

  const handleOpenVideoWorkspace = useCallback(() => {
    if (!isContentTypeInfoDismissed) {
      setIsContentDialogOpen(true)
      return
    }
    setEditedVideo()
  }, [isContentTypeInfoDismissed, setEditedVideo])

  const value = useMemo(
    () => ({
      editedVideoInfo,
      setEditedVideo,
      isWorkspaceOpen,
      setIsWorkspaceOpen,
      uploadVideoButtonProps: {
        to: isContentTypeInfoDismissed ? absoluteRoutes.studio.videoWorkspace() : undefined,
        onClick: handleOpenVideoWorkspace,
      },
    }),
    [editedVideoInfo, setEditedVideo, isWorkspaceOpen, isContentTypeInfoDismissed, handleOpenVideoWorkspace]
  )

  return (
    <VideoWorkspaceContext.Provider value={value}>
      <ContentTypeDialog
        isOpen={isContentTypeDialogOpen}
        onClose={() => setIsContentDialogOpen(false)}
        onSubmit={() => {
          updateDismissedMessages(CONTENT_TYPE_INFO)
          setIsContentDialogOpen(false)
          navigate(absoluteRoutes.studio.videoWorkspace())
        }}
      />
      {children}
    </VideoWorkspaceContext.Provider>
  )
}
