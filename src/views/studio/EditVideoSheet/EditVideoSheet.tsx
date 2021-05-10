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
} from '@/hooks'
import { Container, DrawerOverlay } from './EditVideoSheet.style'
import { useEditVideoSheetAnimations } from './animations'
import { EditVideoTabsBar } from './EditVideoTabsBar'
import { EditVideoForm } from './EditVideoForm'
import {
  CreateVideoMetadata,
  ExtrinsicStatus,
  VideoAssets,
  ExtrinsicSignCancelledError,
  VideoId,
} from '@/joystream-lib'
import { useQueryNodeStateSubscription, useVideo, useRandomStorageProviderUrl, useVideos } from '@/api/hooks'
import { TransactionDialog } from '@/components'
import { computeFileHash } from '@/utils/hashing'
import { FieldNamesMarkedBoolean } from 'react-hook-form'
import { formatISO } from 'date-fns'
import { removeVideoFromCache, writeUrlInCache, writeVideoDataInCache } from '@/utils/cachingAssets'

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
  } = useEditVideoSheet()
  const selectedVideoTab = videoTabs[selectedVideoTabIdx] as EditVideoSheetTab | undefined
  const isEdit = !selectedVideoTab?.isDraft
  const { drawerOverlayAnimationProps, sheetAnimationProps } = useEditVideoSheetAnimations(sheetState)

  const { removeDraft } = useDrafts('video', activeChannelId)

  // transaction management
  const [transactionStatus, setTransactionStatus] = useState<ExtrinsicStatus | null>(null)
  const randomStorageProviderUrl = useRandomStorageProviderUrl()
  const { displaySnackbar } = useSnackbar()
  const [transactionBlock, setTransactionBlock] = useState<number | null>(null)
  const [thumbnailHashPromise, setThumbnailHashPromise] = useState<Promise<string> | null>(null)
  const [videoHashPromise, setVideoHashPromise] = useState<Promise<string> | null>(null)
  const [transactionCallback, setTransactionCallback] = useState<(() => void) | null>(null)
  const { queryNodeState } = useQueryNodeStateSubscription({ skip: transactionStatus !== ExtrinsicStatus.Syncing })
  const { startFileUpload } = useUploadsManager(activeChannelId)
  const { joystream } = useJoystream()
  const { client, refetch: refetchVideo } = useVideo(selectedVideoTab?.id || '', {
    skip: !selectedVideoTab || selectedVideoTab.isDraft,
  })
  const { refetchCount: refetchVideosCount } = useVideos({
    where: {
      channelId_eq: activeChannelId,
    },
  })

  useEffect(() => {
    if (!queryNodeState || transactionStatus !== ExtrinsicStatus.Syncing || !transactionBlock) {
      return
    }

    if (queryNodeState.indexerHead >= transactionBlock) {
      setTransactionStatus(ExtrinsicStatus.Completed)
      transactionCallback?.()
    }
  }, [queryNodeState, transactionBlock, transactionStatus, transactionCallback])

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

    setTransactionStatus(ExtrinsicStatus.ProcessingAssets)

    const isNew = !isEdit

    const metadata: CreateVideoMetadata = {
      ...(isNew || dirtyFields.title ? { title: data.title } : {}),
      ...(isNew || dirtyFields.description ? { description: data.description } : {}),
      ...(isNew || dirtyFields.category ? { category: Number(data.category) } : {}),
      ...(isNew || dirtyFields.isPublic ? { isPublic: data.isPublic } : {}),
      ...((isNew || dirtyFields.hasMarketing) && data.hasMarketing != null ? { hasMarketing: data.hasMarketing } : {}),
      ...((isNew || dirtyFields.isExplicit) && data.isExplicit != null ? { isExplicit: data.isExplicit } : {}),
      ...((isNew || dirtyFields.language) && data.language != null ? { language: data.language } : {}),
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

    let videoId: VideoId = selectedVideoTab.id || ''

    try {
      if (isNew) {
        const { block, data: newVideoId } = await joystream.createVideo(
          activeMemberId,
          activeChannelId,
          metadata,
          assets,
          (status) => {
            setTransactionStatus(status)
          }
        )
        videoId = newVideoId

        setTransactionStatus(ExtrinsicStatus.Syncing)
        setTransactionBlock(block)
        setTransactionCallback(() => async () => {
          const fetchedVideo = await refetchVideo({ where: { id: newVideoId } })

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
            id: newVideoId,
            isDraft: false,
          })
          removeDraft(selectedVideoTab?.id)
        })
      } else {
        const { block } = await joystream.updateVideo(
          videoId,
          activeMemberId,
          activeChannelId,
          metadata,
          assets,
          (status) => {
            setTransactionStatus(status)
          }
        )
        setTransactionStatus(ExtrinsicStatus.Syncing)
        setTransactionBlock(block)
        setTransactionCallback(() => async () => {
          await refetchVideo()
          writeUrlInCache({
            url: data.assets.thumbnail?.url,
            fileType: 'thumbnail',
            parentId: videoId,
            client,
          })
          callback?.()
        })
      }
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
    } catch (e) {
      if (e instanceof ExtrinsicSignCancelledError) {
        console.warn('Sign cancelled')
        setTransactionStatus(null)
        displaySnackbar({ title: 'Transaction signing cancelled', iconType: 'info' })
      } else {
        console.error(e)
        setTransactionStatus(ExtrinsicStatus.Error)
      }
    }
  }

  const toggleMinimizedSheet = () => {
    setSheetState(sheetState === 'open' ? 'minimized' : 'open')
  }

  const closeSheet = () => {
    setSheetState('closed')
  }

  const handleTransactionClose = async () => {
    if (transactionStatus === ExtrinsicStatus.Completed) {
      setTransactionStatus(null)
      setSheetState('minimized')
    }
    setTransactionStatus(null)
  }

  const handleDeleteVideo = async (videoId: string) => {
    const videoTabIdx = videoTabs.findIndex((vt) => vt.id === videoId)
    await refetchVideosCount()
    removeVideoTab(videoTabIdx)
    removeVideoFromCache(videoId, client)

    // close the sheet if we closed the last tab
    setSheetState(videoTabs.length === 1 ? 'closed' : 'minimized')
  }

  return (
    <>
      <TransactionDialog
        status={transactionStatus}
        successTitle={!isEdit ? 'Video successfully created!' : 'Video successfully updated!'}
        successDescription={
          !isEdit
            ? 'Your video was created and saved on the blockchain. Upload of video assets may still be in progress.'
            : 'Changes to your video were saved on the blockchain.'
        }
        onClose={handleTransactionClose}
      />
      <DrawerOverlay style={drawerOverlayAnimationProps} />
      <Container role="dialog" style={sheetAnimationProps}>
        <EditVideoTabsBar
          videoTabs={videoTabs}
          selectedVideoTab={selectedVideoTab}
          onAddNewTabClick={() => addVideoTab()}
          onRemoveTabClick={removeVideoTab}
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
        />
      </Container>
    </>
  )
}
