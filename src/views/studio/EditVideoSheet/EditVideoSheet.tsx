import React, { useEffect, useState } from 'react'
import {
  useEditVideoSheet,
  useAuthorizedUser,
  useUploadsManager,
  useSnackbar,
  useJoystream,
  EditVideoFormFields,
  EditVideoSheetTab,
  useDrafts,
  useDisplayDataLostWarning,
  useTransactionManager,
} from '@/hooks'
import { Container, DrawerOverlay } from './EditVideoSheet.style'
import { useEditVideoSheetAnimations } from './animations'
import { EditVideoTabsBar } from './EditVideoTabsBar'
import { EditVideoForm } from './EditVideoForm'
import { CreateVideoMetadata, VideoAssets, VideoId } from '@/joystream-lib'
import { useVideo, useRandomStorageProviderUrl, useVideos } from '@/api/hooks'
import { computeFileHash } from '@/utils/hashing'
import { FieldNamesMarkedBoolean } from 'react-hook-form'
import { formatISO } from 'date-fns'
import { writeUrlInCache, writeVideoDataInCache } from '@/utils/cachingAssets'

export const EditVideoSheet: React.FC = () => {
  const { activeChannelId, activeMemberId } = useAuthorizedUser()

  // sheet state
  const {
    sheetState,
    setSheetState,
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
  } = useEditVideoSheet()
  const selectedVideoTab = videoTabs[selectedVideoTabIdx] as EditVideoSheetTab | undefined
  const isEdit = !selectedVideoTab?.isDraft
  const { containerRef, drawerOverlayAnimationProps, sheetAnimationProps } = useEditVideoSheetAnimations(sheetState)

  const { removeDraft } = useDrafts('video', activeChannelId)

  // transaction management
  const randomStorageProviderUrl = useRandomStorageProviderUrl()
  const { displaySnackbar } = useSnackbar()
  const [thumbnailHashPromise, setThumbnailHashPromise] = useState<Promise<string> | null>(null)
  const [videoHashPromise, setVideoHashPromise] = useState<Promise<string> | null>(null)
  const { startFileUpload } = useUploadsManager(activeChannelId)
  const { joystream } = useJoystream()
  const { fee, handleTransaction } = useTransactionManager()
  const { client, refetch: refetchVideo } = useVideo(selectedVideoTab?.id || '', {
    skip: !selectedVideoTab || selectedVideoTab.isDraft,
  })
  const { refetchCount: refetchVideosCount } = useVideos({
    where: {
      channelId_eq: activeChannelId,
    },
  })
  const { DataLostWarningDialog, openWarningDialog } = useDisplayDataLostWarning()

  useEffect(() => {
    if (sheetState === 'closed' || !anyVideoTabsCachedAssets) {
      return
    }

    const beforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', beforeUnload)
    return () => {
      window.removeEventListener('beforeunload', beforeUnload)
    }
  }, [sheetState, anyVideoTabsCachedAssets])

  const handleVideoFileChange = (file: Blob) => {
    const hashPromise = computeFileHash(file)
    setVideoHashPromise(hashPromise)
  }

  const handleThumbnailFileChange = (file: Blob) => {
    const hashPromise = computeFileHash(file)
    setThumbnailHashPromise(hashPromise)
  }

  const handleSubmit = async (
    data: EditVideoFormFields,
    dirtyFields: FieldNamesMarkedBoolean<EditVideoFormFields>,
    callback?: () => void
  ) => {
    if (!selectedVideoTab) {
      return
    }
    const { video: videoInputFile, thumbnail: thumbnailInputFile } = data.assets

    if (!joystream) {
      return
    }

    const isNew = !isEdit
    const license = {
      code: data.licenseCode ?? undefined,
      attribution: data.licenseAttribution ?? undefined,
      customText: data.licenseCustomText ?? undefined,
    }

    const metadata: CreateVideoMetadata = {
      ...(isNew || dirtyFields.title ? { title: data.title } : {}),
      ...(isNew || dirtyFields.description ? { description: data.description } : {}),
      ...(isNew || dirtyFields.category ? { category: Number(data.category) } : {}),
      ...(isNew || dirtyFields.isPublic ? { isPublic: data.isPublic } : {}),
      ...((isNew || dirtyFields.hasMarketing) && data.hasMarketing != null ? { hasMarketing: data.hasMarketing } : {}),
      ...((isNew || dirtyFields.isExplicit) && data.isExplicit != null ? { isExplicit: data.isExplicit } : {}),
      ...((isNew || dirtyFields.language) && data.language != null ? { language: data.language } : {}),
      ...((isNew || dirtyFields.licenseCode) && data.licenseCode != null ? { license } : {}),
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
      if (videoInputFile?.blob && videoHashPromise) {
        const [asset, contentId] = joystream.createFileAsset({
          size: videoInputFile.blob.size,
          ipfsContentId: await videoHashPromise,
        })
        assets.video = asset
        videoContentId = contentId
      } else if (dirtyFields.assets?.video) {
        console.warn('Missing video data')
      }

      if (thumbnailInputFile?.blob && thumbnailHashPromise) {
        const [asset, contentId] = joystream.createFileAsset({
          size: thumbnailInputFile.blob.size,
          ipfsContentId: await thumbnailHashPromise,
        })
        assets.thumbnail = asset
        thumbnailContentId = contentId
      } else if (dirtyFields.assets?.thumbnail) {
        console.warn('Missing thumbnail data')
      }
    }

    const uploadAssets = (videoId: VideoId) => {
      let uploadCount = 0

      if (videoInputFile?.blob && videoContentId && randomStorageProviderUrl) {
        const { mediaPixelWidth: width, mediaPixelHeight: height } = videoInputFile
        startFileUpload(
          videoInputFile.blob,
          {
            contentId: videoContentId,
            owner: activeChannelId,
            parentObject: {
              type: 'video',
              id: videoId,
            },
            type: 'video',
            dimensions: width && height ? { width, height } : undefined,
          },
          randomStorageProviderUrl
        )
        uploadCount++
      }
      if (thumbnailInputFile?.blob && thumbnailContentId && randomStorageProviderUrl) {
        startFileUpload(
          thumbnailInputFile.blob,
          {
            contentId: thumbnailContentId,
            owner: activeChannelId,
            parentObject: {
              type: 'video',
              id: videoId,
            },
            type: 'thumbnail',
            dimensions: thumbnailInputFile.assetDimensions,
            imageCropData: thumbnailInputFile.imageCropData,
          },
          randomStorageProviderUrl
        )
        uploadCount++
      }

      if (uploadCount > 0) {
        displaySnackbar({ title: `(${uploadCount}) Assets being uploaded`, iconType: 'info' })
      }
    }

    const refetchDataAndCacheAssets = async (videoId: VideoId) => {
      const fetchedVideo = await refetchVideo({ where: { id: videoId } })

      if (isNew) {
        if (fetchedVideo.data.videoByUniqueInput) {
          writeVideoDataInCache({
            data: fetchedVideo.data.videoByUniqueInput,
            thumbnailUrl: data.assets.thumbnail?.url,
            client,
          })
        }
        // update videos count only after inserting video in cache to not trigger refetch in "my videos" on missing video
        await refetchVideosCount()

        updateSelectedVideoTab({
          id: videoId,
          isDraft: false,
        })
        removeDraft(selectedVideoTab?.id)
      } else {
        writeUrlInCache({
          url: data.assets.thumbnail?.url,
          fileType: 'thumbnail',
          parentId: videoId,
          client,
        })
      }
      setSelectedVideoTabCachedAssets({ video: null, thumbnail: null })
      setSelectedVideoTabCachedDirtyFormData({})

      // allow for the changes in refetched video to propagate first
      setTimeout(() => {
        callback?.()
      })
    }

    handleTransaction({
      preProcess: processAssets,
      txFactory: (updateStatus) =>
        isNew
          ? joystream.createVideo(activeMemberId, activeChannelId, metadata, assets, updateStatus)
          : joystream.updateVideo(selectedVideoTab.id, activeMemberId, activeChannelId, metadata, assets, updateStatus),
      onTxFinalize: uploadAssets,
      onTxSync: refetchDataAndCacheAssets,
      onTxClose: (completed) => completed && setSheetState('minimized'),
      successMessage: {
        title: isNew ? 'Video successfully created!' : 'Video successfully updated!',
        description: isNew
          ? 'Your video was created and saved on the blockchain. Upload of video assets may still be in progress.'
          : 'Changes to your video were saved on the blockchain.',
      },
    })
  }

  const toggleMinimizedSheet = () => {
    setSheetState(sheetState === 'open' ? 'minimized' : 'open')
  }

  const handleDeleteVideo = async (videoId: string) => {
    const videoTabIdx = videoTabs.findIndex((vt) => vt.id === videoId)
    removeVideoTab(videoTabIdx)

    // close the sheet if we closed the last tab
    setSheetState(videoTabs.length === 1 ? 'closed' : 'minimized')
  }

  const closeSheet = () => {
    if (anyVideoTabsCachedAssets) {
      openWarningDialog({ onConfirm: () => setSheetState('closed') })
    } else {
      setSheetState('closed')
    }
  }

  const handleRemoveVideoTab = (tabIdx: number) => {
    if (hasVideoTabAnyCachedAssets(tabIdx)) {
      openWarningDialog({ onConfirm: () => removeVideoTab(tabIdx) })
    } else {
      removeVideoTab(tabIdx)
    }
  }

  return (
    <>
      <DataLostWarningDialog />
      <DrawerOverlay style={drawerOverlayAnimationProps} />
      <Container ref={containerRef} role="dialog" style={sheetAnimationProps}>
        <EditVideoTabsBar
          videoTabs={videoTabs}
          selectedVideoTab={selectedVideoTab}
          onAddNewTabClick={() => addVideoTab()}
          onRemoveTabClick={handleRemoveVideoTab}
          onTabSelect={setSelectedVideoTabIdx}
          onCloseClick={closeSheet}
          onToggleMinimizedClick={toggleMinimizedSheet}
        />
        <EditVideoForm
          onDeleteVideo={handleDeleteVideo}
          selectedVideoTab={selectedVideoTab}
          onSubmit={handleSubmit}
          onThumbnailFileChange={handleThumbnailFileChange}
          onVideoFileChange={handleVideoFileChange}
          fee={fee}
        />
      </Container>
    </>
  )
}
