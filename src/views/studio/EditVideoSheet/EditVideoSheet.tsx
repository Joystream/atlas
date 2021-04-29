import React, { useEffect, useState } from 'react'
import {
  useEditVideoSheet,
  useActiveUser,
  useUploadsManager,
  useSnackbar,
  useJoystream,
  EditVideoFormFields,
  EditVideoSheetTab,
} from '@/hooks'
import { Container, DrawerOverlay } from './EditVideoSheet.style'
import { useEditVideoSheetAnimations } from './animations'
import { EditVideoTabsBar } from './EditVideoTabsBar'
import { EditVideoForm } from './EditVideoForm'
import { CreateVideoMetadata, ExtrinsicStatus, VideoAssets, ExtensionSignCancelledError } from '@/joystream-lib'
import { useQueryNodeStateSubscription } from '@/api/hooks'
import { TransactionDialog } from '@/components'
import { computeFileHash } from '@/utils/hashing'

export const EditVideoSheet: React.FC = () => {
  const {
    activeUser: { channelId, memberId },
  } = useActiveUser()

  // sheet state
  const {
    sheetState,
    setSheetState,
    videoTabs,
    selectedVideoTabIdx,
    setSelectedVideoTabIdx,
    addVideoTab,
    removeVideoTab,
  } = useEditVideoSheet()
  const selectedVideoTab = videoTabs[selectedVideoTabIdx] as EditVideoSheetTab | undefined
  const { drawerOverlayAnimationProps, sheetAnimationProps } = useEditVideoSheetAnimations(sheetState)

  // transaction management
  const [transactionStatus, setTransactionStatus] = useState<ExtrinsicStatus | null>(null)
  const { displaySnackbar } = useSnackbar()
  const [transactionBlock, setTransactionBlock] = useState<number | null>(null)
  const [thumbnailHashPromise, setThumbnailHashPromise] = useState<Promise<string> | null>(null)
  const [videoHashPromise, setVideoHashPromise] = useState<Promise<string> | null>(null)
  const { queryNodeState } = useQueryNodeStateSubscription({ skip: transactionStatus !== ExtrinsicStatus.Syncing })
  const { startFileUpload } = useUploadsManager(channelId || '')
  const { joystream } = useJoystream()

  useEffect(() => {
    if (!queryNodeState || transactionStatus !== ExtrinsicStatus.Syncing || !transactionBlock) {
      return
    }

    if (queryNodeState.indexerHead >= transactionBlock) {
      setTransactionStatus(ExtrinsicStatus.Completed)
    }
  }, [queryNodeState, transactionBlock, transactionStatus])

  const handleVideoFileChange = (file: Blob) => {
    const hashPromise = computeFileHash(file)
    setVideoHashPromise(hashPromise)
  }

  const handleThumbnailFileChange = (file: Blob) => {
    const hashPromise = computeFileHash(file)
    setThumbnailHashPromise(hashPromise)
  }

  const handleSubmit = async (data: EditVideoFormFields) => {
    if (!selectedVideoTab) {
      return
    }
    const { video: videoInputFile, thumbnail: thumbnailInputFile } = data.assets

    if (!videoInputFile?.url || !videoInputFile?.blob) {
      // setFileSelectError('Video was not provided')
      return
    }
    if (!thumbnailInputFile?.url || !thumbnailInputFile?.blob) {
      // setFileSelectError('Thumbnail was not provided')
      return
    }
    if (!joystream || !memberId || !channelId) {
      return
    }

    // setFileSelectError(null)

    setTransactionStatus(ExtrinsicStatus.ProcessingAssets)

    const metadata: CreateVideoMetadata = {
      ...(data.title ? { title: data.title } : {}),
      ...(data.description ? { description: data.description } : {}),
      ...(data.category ? { category: Number(data.category) } : {}),
      ...(data.isPublic != null ? { isPublic: data.isPublic } : {}),
      ...(data.hasMarketing != null ? { hasMarketing: data.hasMarketing } : {}),
      ...(data.isExplicit != null ? { isExplicit: data.isExplicit } : {}),
      ...(data.language ? { language: data.language } : {}),
      ...(data.publishedBeforeJoystream
        ? {
            publishedBeforeJoystream: {
              isPublished: true,
              date: data.publishedBeforeJoystream.toString(),
            },
          }
        : {}),
      ...(videoInputFile.mimeType
        ? {
            mediaType: {
              mimeMediaType: videoInputFile.mimeType,
            },
          }
        : {}),
      ...(videoInputFile.duration ? { duration: Math.round(videoInputFile.duration) } : {}),
      ...(videoInputFile.mediaPixelHeight ? { mediaPixelHeight: videoInputFile.mediaPixelHeight } : {}),
      ...(videoInputFile.mediaPixelWidth ? { mediaPixelWidth: videoInputFile.mediaPixelWidth } : {}),
    }

    const assets: VideoAssets = {}
    let videoContentId = ''
    let thumbnailContentId = ''

    if (videoInputFile.blob && videoHashPromise) {
      const [asset, contentId] = joystream.createFileAsset({
        size: videoInputFile.blob.size,
        ipfsContentId: await videoHashPromise,
      })
      assets.video = asset
      videoContentId = contentId
    } else {
      console.warn('Missing video data')
    }

    if (thumbnailInputFile.blob && thumbnailHashPromise) {
      const [asset, contentId] = joystream.createFileAsset({
        size: thumbnailInputFile.blob.size,
        ipfsContentId: await thumbnailHashPromise,
      })
      assets.thumbnail = asset
      thumbnailContentId = contentId
    } else {
      console.warn('Missing thumbnail data')
    }

    try {
      const { block, data: videoId } = await joystream.createVideo(memberId, channelId, metadata, assets, (status) => {
        setTransactionStatus(status)
      })

      setTransactionStatus(ExtrinsicStatus.Syncing)
      setTransactionBlock(block)

      if (videoInputFile.blob && videoContentId) {
        startFileUpload(videoInputFile.blob, {
          contentId: videoContentId,
          owner: channelId,
          parentObject: {
            type: 'video',
            id: videoId,
          },
          type: 'video',
        })
      }
      if (thumbnailInputFile.blob && thumbnailContentId) {
        startFileUpload(thumbnailInputFile.blob, {
          contentId: thumbnailContentId,
          owner: channelId,
          parentObject: {
            type: 'video',
            id: videoId,
          },
          type: 'thumbnail',
        })
      }
    } catch (e) {
      if (e instanceof ExtensionSignCancelledError) {
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
      if (selectedVideoTab?.id) {
        // TODO: remove
        // removeDraft(selectedVideoTab?.id)
      }
      setTransactionStatus(null)
      setSheetState('minimized')
      // TODO: reset?
      // reset()
    }
    setTransactionStatus(null)
  }

  return (
    <>
      <TransactionDialog
        status={transactionStatus}
        successTitle={selectedVideoTab?.isDraft ? 'Video successfully created!' : 'Video successfully updated!'}
        successDescription={
          selectedVideoTab?.isDraft
            ? 'Your video was created and saved on the blockchain.'
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
          selectedVideoTab={selectedVideoTab}
          onSubmit={handleSubmit}
          onThumbnailFileChange={handleThumbnailFileChange}
          onVideoFileChange={handleVideoFileChange}
        />
      </Container>
    </>
  )
}
