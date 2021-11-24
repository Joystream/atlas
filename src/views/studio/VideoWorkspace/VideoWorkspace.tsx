import { useApolloClient } from '@apollo/client'
import { formatISO } from 'date-fns'
import React, { useCallback, useEffect, useState } from 'react'
import { FieldNamesMarkedBoolean } from 'react-hook-form'

import {
  GetVideosConnectionDocument,
  GetVideosConnectionQuery,
  GetVideosConnectionQueryVariables,
  VideoOrderByInput,
} from '@/api/queries'
import { useDisplayDataLostWarning } from '@/hooks/useDisplayDataLostWarning'
import { CreateVideoMetadata, VideoAssets, VideoId } from '@/joystream-lib'
import { useAssetStore, useRawAssetResolver } from '@/providers/assets'
import { useDraftStore } from '@/providers/drafts'
import { useJoystream } from '@/providers/joystream'
import { useTransaction } from '@/providers/transactionManager'
import { useStartFileUpload } from '@/providers/uploadsManager'
import { useAuthorizedUser } from '@/providers/user'
import { VideoWorkspaceFormFields, VideoWorkspaceTab, useVideoWorkspace } from '@/providers/videoWorkspace'
import { writeVideoDataInCache } from '@/utils/cachingAssets'
import { computeFileHash } from '@/utils/hashing'
import { ConsoleLogger, SentryLogger } from '@/utils/logs'

import { Container, DrawerOverlay } from './VideoWorkspace.style'
import { VideoWorkspaceForm } from './VideoWorkspaceForm'
import { VideoWorkspaceTabsBar } from './VideoWorkspaceTabsBar'
import { useVideoWorkspaceAnimations } from './animations'

export const VideoWorkspace: React.FC = React.memo(() => {
  const { activeChannelId, activeMemberId } = useAuthorizedUser()

  // videoWorkspace state
  const {
    videoWorkspaceState,
    setVideoWorkspaceState,
    videoTabs,
    selectedVideoTabIdx,
    setSelectedVideoTabIdx,
    addVideoTab,
    removeVideoTab,
    updateSelectedVideoTab,
    anyVideoTabsCachedAssets,
    hasVideoTabAnyCachedAssets,
    setSelectedVideoTabCachedAssets,
    setSelectedVideoTabCachedDirtyFormData,
  } = useVideoWorkspace()
  const selectedVideoTab = videoTabs[selectedVideoTabIdx] as VideoWorkspaceTab | undefined
  const isEdit = !selectedVideoTab?.isDraft
  const { containerRef, drawerOverlayAnimationProps, videoWorkspaceAnimationProps } =
    useVideoWorkspaceAnimations(videoWorkspaceState)

  const { openWarningDialog } = useDisplayDataLostWarning()
  const removeDrafts = useDraftStore((state) => state.actions.removeDrafts)

  // transaction management
  const [thumbnailHashPromise, setThumbnailHashPromise] = useState<Promise<string> | null>(null)
  const [videoHashPromise, setVideoHashPromise] = useState<Promise<string> | null>(null)
  const startFileUpload = useStartFileUpload()
  const { joystream } = useJoystream()
  const handleTransaction = useTransaction()
  const client = useApolloClient()
  const addAsset = useAssetStore((state) => state.actions.addAsset)
  const resolveAsset = useRawAssetResolver()

  useEffect(() => {
    if (videoWorkspaceState === 'closed' || !anyVideoTabsCachedAssets) {
      return
    }
    window.onbeforeunload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      return ''
    }
    return () => {
      window.onbeforeunload = null
    }
  }, [videoWorkspaceState, anyVideoTabsCachedAssets])

  const handleVideoFileChange = useCallback((file: Blob) => {
    const hashPromise = computeFileHash(file)
    setVideoHashPromise(hashPromise)
  }, [])

  const handleThumbnailFileChange = useCallback((file: Blob) => {
    const hashPromise = computeFileHash(file)
    setThumbnailHashPromise(hashPromise)
  }, [])

  const handleSubmit = useCallback(
    async (
      data: VideoWorkspaceFormFields,
      dirtyFields: FieldNamesMarkedBoolean<VideoWorkspaceFormFields>,
      callback?: () => void
    ) => {
      if (!selectedVideoTab || !joystream) {
        return
      }
      const { video: videoInputFile, thumbnail: thumbnailInputFile } = data.assets
      const videoAsset = resolveAsset(videoInputFile.contentId)
      const thumbnailAsset = resolveAsset(thumbnailInputFile.cropContentId)

      const isNew = !isEdit
      const license = {
        code: data.licenseCode ?? undefined,
        attribution: data.licenseAttribution ?? undefined,
        customText: data.licenseCustomText ?? undefined,
      }
      const anyLicenseFieldsDirty =
        dirtyFields.licenseCode || dirtyFields.licenseAttribution || dirtyFields.licenseCustomText

      const metadata: CreateVideoMetadata = {
        ...(isNew || dirtyFields.title ? { title: data.title } : {}),
        ...(isNew || dirtyFields.description ? { description: data.description } : {}),
        ...(isNew || dirtyFields.category ? { category: Number(data.category) } : {}),
        ...(isNew || dirtyFields.isPublic ? { isPublic: data.isPublic } : {}),
        ...((isNew || dirtyFields.hasMarketing) && data.hasMarketing != null
          ? { hasMarketing: data.hasMarketing }
          : {}),
        ...((isNew || dirtyFields.isExplicit) && data.isExplicit != null ? { isExplicit: data.isExplicit } : {}),
        ...((isNew || dirtyFields.language) && data.language != null ? { language: data.language } : {}),
        ...(isNew || anyLicenseFieldsDirty ? { license } : {}),
        ...((isNew || dirtyFields.publishedBeforeJoystream) && data.publishedBeforeJoystream != null
          ? {
              publishedBeforeJoystream: formatISO(data.publishedBeforeJoystream),
            }
          : {}),
        ...(isNew || dirtyFields.assets?.video
          ? {
              mimeMediaType: videoInputFile?.mimeType,
            }
          : {}),
        ...(isNew || dirtyFields.assets?.video ? { duration: Math.round(videoInputFile?.duration || 0) } : {}),
        ...(isNew || dirtyFields.assets?.video ? { mediaPixelHeight: videoInputFile?.mediaPixelHeight } : {}),
        ...(isNew || dirtyFields.assets?.video ? { mediaPixelWidth: videoInputFile?.mediaPixelWidth } : {}),
      }

      const assets: VideoAssets = {}
      let videoContentId = ''
      let thumbnailContentId = ''

      const processAssets = async () => {
        if (videoAsset?.blob && videoHashPromise) {
          const [asset, contentId] = joystream.createFileAsset({
            size: videoAsset.blob.size,
            ipfsContentId: await videoHashPromise,
          })
          assets.video = asset
          videoContentId = contentId
        } else if (dirtyFields.assets?.video) {
          ConsoleLogger.warn('Missing video data')
        }

        if (thumbnailAsset?.blob && thumbnailHashPromise) {
          const [asset, contentId] = joystream.createFileAsset({
            size: thumbnailAsset.blob.size,
            ipfsContentId: await thumbnailHashPromise,
          })
          assets.thumbnail = asset
          thumbnailContentId = contentId
        } else if (dirtyFields.assets?.thumbnail) {
          ConsoleLogger.warn('Missing thumbnail data')
        }
      }

      const uploadAssets = async (videoId: VideoId) => {
        const uploadPromises: Promise<unknown>[] = []
        if (videoAsset?.blob && videoContentId) {
          const { mediaPixelWidth: width, mediaPixelHeight: height } = videoInputFile
          const uploadPromise = startFileUpload(videoAsset.blob, {
            contentId: videoContentId,
            owner: activeChannelId,
            parentObject: {
              type: 'video',
              id: videoId,
              title: metadata.title,
            },
            type: 'video',
            dimensions: width && height ? { width, height } : undefined,
          })
          uploadPromises.push(uploadPromise)
        }
        if (thumbnailAsset?.blob && thumbnailContentId) {
          const uploadPromise = startFileUpload(thumbnailAsset.blob, {
            contentId: thumbnailContentId,
            owner: activeChannelId,
            parentObject: {
              type: 'video',
              id: videoId,
            },
            type: 'thumbnail',
            dimensions: thumbnailInputFile.assetDimensions,
            imageCropData: thumbnailInputFile.imageCropData,
          })
          uploadPromises.push(uploadPromise)
        }
        Promise.all(uploadPromises).catch((e) => SentryLogger.error('Unexpected upload failure', 'VideoWorkspace', e))
      }

      const refetchDataAndCacheAssets = async (videoId: VideoId) => {
        // add resolution for newly created asset
        addAsset(thumbnailContentId, { url: thumbnailAsset?.url })

        const fetchedVideo = await client.query<GetVideosConnectionQuery, GetVideosConnectionQueryVariables>({
          query: GetVideosConnectionDocument,
          variables: {
            orderBy: VideoOrderByInput.CreatedAtDesc,
            where: {
              id_eq: videoId,
            },
          },
          fetchPolicy: 'network-only',
        })

        if (isNew) {
          if (fetchedVideo.data.videosConnection?.edges[0]) {
            writeVideoDataInCache({
              edge: fetchedVideo.data.videosConnection.edges[0],
              client,
            })
          }

          updateSelectedVideoTab({
            id: videoId,
            isDraft: false,
          })
          removeDrafts([selectedVideoTab?.id])
        }
        setSelectedVideoTabCachedAssets(null)
        setSelectedVideoTabCachedDirtyFormData({})

        // allow for the changes in refetched video to propagate first
        setTimeout(() => {
          callback?.()
        })
      }

      const completed = await handleTransaction({
        preProcess: processAssets,
        txFactory: (updateStatus) =>
          isNew
            ? joystream.createVideo(activeMemberId, activeChannelId, metadata, assets, updateStatus)
            : joystream.updateVideo(
                selectedVideoTab.id,
                activeMemberId,
                activeChannelId,
                metadata,
                assets,
                updateStatus
              ),
        onTxFinalize: uploadAssets,
        onTxSync: refetchDataAndCacheAssets,
        successMessage: {
          title: isNew ? 'Video successfully created!' : 'Video successfully updated!',
          description: isNew
            ? 'Your video was created and saved on the blockchain. Upload of video assets may still be in progress.'
            : 'Changes to your video were saved on the blockchain.',
        },
      })

      if (completed) {
        setVideoWorkspaceState('minimized')
        removeVideoTab(selectedVideoTabIdx)
      }
    },
    [
      activeChannelId,
      activeMemberId,
      addAsset,
      client,
      handleTransaction,
      isEdit,
      joystream,
      removeDrafts,
      removeVideoTab,
      resolveAsset,
      selectedVideoTab,
      selectedVideoTabIdx,
      setSelectedVideoTabCachedAssets,
      setSelectedVideoTabCachedDirtyFormData,
      setVideoWorkspaceState,
      startFileUpload,
      thumbnailHashPromise,
      updateSelectedVideoTab,
      videoHashPromise,
    ]
  )

  const toggleMinimizedVideoWorkspace = useCallback(() => {
    setVideoWorkspaceState(videoWorkspaceState === 'open' ? 'minimized' : 'open')
  }, [setVideoWorkspaceState, videoWorkspaceState])

  const handleDeleteVideo = useCallback(
    (videoId: string) => {
      const videoTabIdx = videoTabs.findIndex((vt) => vt.id === videoId)
      removeVideoTab(videoTabIdx)

      // close the videoWorkspace if we closed the last tab
      setVideoWorkspaceState(videoTabs.length === 1 ? 'closed' : 'minimized')
    },
    [removeVideoTab, setVideoWorkspaceState, videoTabs]
  )

  const closeVideoWorkspace = useCallback(() => {
    if (anyVideoTabsCachedAssets) {
      openWarningDialog({ onConfirm: () => setVideoWorkspaceState('closed') })
    } else {
      setVideoWorkspaceState('closed')
    }
  }, [anyVideoTabsCachedAssets, openWarningDialog, setVideoWorkspaceState])

  const handleRemoveVideoTab = useCallback(
    (tabIdx: number) => {
      if (hasVideoTabAnyCachedAssets(tabIdx)) {
        openWarningDialog({ onConfirm: () => removeVideoTab(tabIdx) })
      } else {
        removeVideoTab(tabIdx)
      }
    },
    [hasVideoTabAnyCachedAssets, openWarningDialog, removeVideoTab]
  )

  const onTabSelect = useCallback(
    (tabIdx: number) => {
      setSelectedVideoTabIdx(tabIdx)
      setVideoWorkspaceState('open')
    },
    [setSelectedVideoTabIdx, setVideoWorkspaceState]
  )

  return (
    <>
      <DrawerOverlay style={drawerOverlayAnimationProps} />
      <Container ref={containerRef} role="dialog" style={videoWorkspaceAnimationProps}>
        <VideoWorkspaceTabsBar
          videoTabs={videoTabs}
          selectedVideoTab={selectedVideoTab}
          videoWorkspaceState={videoWorkspaceState}
          onAddNewTabClick={addVideoTab}
          onRemoveTabClick={handleRemoveVideoTab}
          onTabSelect={onTabSelect}
          onCloseClick={closeVideoWorkspace}
          onToggleMinimizedClick={toggleMinimizedVideoWorkspace}
        />
        <VideoWorkspaceForm
          onDeleteVideo={handleDeleteVideo}
          selectedVideoTab={selectedVideoTab}
          onSubmit={handleSubmit}
          onThumbnailFileChange={handleThumbnailFileChange}
          onVideoFileChange={handleVideoFileChange}
          fee={0}
        />
      </Container>
    </>
  )
})

VideoWorkspace.displayName = 'VideoWorkspace'
