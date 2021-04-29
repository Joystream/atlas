import React, { useEffect, useState } from 'react'
import { FileRejection } from 'react-dropzone'
import { FileState } from '@/shared/components/MultiFileSelect/MultiFileSelect'
import { MultiFileSelect } from '@/shared/components'
import {
  useDrafts,
  useEditVideoSheet,
  useActiveUser,
  useUploadsManager,
  useSnackbar,
  useJoystream,
  EditVideoFormFields,
} from '@/hooks'
import { Container, Content, DrawerOverlay } from './EditVideoSheet.style'
import { useEditVideoSheetAnimations } from './animations'
import { EditVideoTabsBar } from './EditVideoTabsBar'
import { EditVideoForm } from './EditVideoForm'
import { CreateVideoMetadata, ExtrinsicStatus, VideoAssets, ExtensionSignCancelledError } from '@/joystream-lib'
import { useQueryNodeStateSubscription } from '@/api/hooks'
import { TransactionDialog } from '@/components'
import { computeFileHash } from '@/utils/hashing'
import { getVideoMetadata } from '@/utils/video'
import { FileType } from '@/types/files'

type Asset = {
  url: string | null
  blob: Blob | File | null
}

type VideoAsset = {
  duration?: number
  mediaPixelWidth?: number
  mediaPixelHeight?: number
  mimeType?: string
  size?: number
} & Asset

type FileStateWithDraftId = {
  id?: string
  files: FileState
}

type CroppedImageUrlsWithDraftId = {
  id?: string
  url: string | null
}

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
  const { drawerOverlayAnimationProps, sheetAnimationProps } = useEditVideoSheetAnimations(sheetState)
  const selectedVideoTab = videoTabs[selectedVideoTabIdx]

  // transaction management
  const [transactionStatus, setTransactionStatus] = useState<ExtrinsicStatus | null>(null)
  const { displaySnackbar } = useSnackbar()
  const [transactionBlock, setTransactionBlock] = useState<number | null>(null)
  const [thumbnailHashPromise, setThumbnailHashPromise] = useState<Promise<string> | null>(null)
  const [videoHashPromise, setVideoHashPromise] = useState<Promise<string> | null>(null)
  const { queryNodeState } = useQueryNodeStateSubscription({ skip: transactionStatus !== ExtrinsicStatus.Syncing })
  const { startFileUpload } = useUploadsManager(channelId || '')
  const { joystream } = useJoystream()

  // TODO: delete?
  const { drafts } = useDrafts('video', channelId ?? '')
  const [video, setVideo] = useState<VideoAsset>({
    url: null,
    blob: null,
  })
  const [thumbnail, setThumbnail] = useState<Asset>({
    url: null,
    blob: null,
  })

  // forms state
  const [fileSelectError, setFileSelectError] = useState<string | null>(null)
  const [files, setFiles] = useState<FileStateWithDraftId[]>([])
  const [croppedImageUrls, setCroppedImageUrls] = useState<CroppedImageUrlsWithDraftId[]>([])

  // video hash
  useEffect(() => {
    if (!video.blob) {
      return
    }

    const hashPromise = computeFileHash(video.blob)
    setVideoHashPromise(hashPromise)
  }, [video.blob])

  // thumbnail hash
  useEffect(() => {
    if (!thumbnail.blob) {
      return
    }

    const hashPromise = computeFileHash(thumbnail.blob)
    setThumbnailHashPromise(hashPromise)
  }, [thumbnail.blob])

  useEffect(() => {
    if (!queryNodeState || transactionStatus !== ExtrinsicStatus.Syncing || !transactionBlock) {
      return
    }

    if (queryNodeState.indexerHead >= transactionBlock) {
      setTransactionStatus(ExtrinsicStatus.Completed)
    }
  }, [queryNodeState, transactionBlock, transactionStatus])

  const handleSubmit = async (data: EditVideoFormFields) => {
    if (!video.url || !video.blob) {
      setFileSelectError('Video was not provided')
      return
    }
    if (!thumbnail.url || !thumbnail.blob) {
      setFileSelectError('Thumbnail was not provided')
      return
    }
    if (!joystream || !memberId || !channelId) {
      return
    }

    setFileSelectError(null)

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
      ...(video.mimeType
        ? {
            mediaType: {
              mimeMediaType: video.mimeType,
            },
          }
        : {}),
      ...(video.duration ? { duration: Math.round(video.duration) } : {}),
      ...(video.mediaPixelHeight ? { mediaPixelHeight: video.mediaPixelHeight } : {}),
      ...(video.mediaPixelWidth ? { mediaPixelWidth: video.mediaPixelWidth } : {}),
    }

    const assets: VideoAssets = {}
    let videoContentId = ''
    let thumbnailContentId = ''

    if (video.blob && videoHashPromise) {
      const [asset, contentId] = joystream.createFileAsset({
        size: video.blob.size,
        ipfsContentId: await videoHashPromise,
      })
      assets.video = asset
      videoContentId = contentId
    } else {
      console.warn('Missing video data')
    }

    if (thumbnail.blob && thumbnailHashPromise) {
      const [asset, contentId] = joystream.createFileAsset({
        size: thumbnail.blob.size,
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

      if (video.blob && videoContentId) {
        startFileUpload(video.blob, {
          contentId: videoContentId,
          owner: channelId,
          parentObject: {
            type: 'video',
            id: videoId,
          },
          type: 'video',
        })
      }
      if (thumbnail.blob && thumbnailContentId) {
        startFileUpload(thumbnail.blob, {
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

  const handleChangeFiles = async (changeFiles: FileState) => {
    if (changeFiles.video) {
      try {
        const url = URL.createObjectURL(changeFiles.video)
        const videoMetadata = await getVideoMetadata(changeFiles.video)
        setVideo({
          duration: videoMetadata.duration,
          mediaPixelHeight: videoMetadata.height,
          mediaPixelWidth: videoMetadata.width,
          size: videoMetadata.sizeInBytes,
          mimeType: videoMetadata.mimeType,
          blob: changeFiles.video,
          url,
        })
      } catch (error) {
        setFileSelectError('Wrong file type')
        return
      }
      const hasFiles = files.some((f) => f.id === selectedVideoTab?.id)
      const draft = drafts.find((draft) => draft.id === selectedVideoTab?.id)
      if (draft?.title === 'New Draft') {
        // TODO: set draft name
        // await updateDraft(draft.id, { title: changeFiles.video?.name })
        // reset(resetFields(draft))
      }
      if (hasFiles) {
        const newFiles = files.map((f) => {
          if (f.id === selectedVideoTab?.id) {
            return { ...f, files: { ...changeFiles } }
          }
          return f
        })
        setFiles(newFiles)
      } else {
        setFiles([...files, { id: selectedVideoTab?.id, files: changeFiles }])
      }
    }
  }

  const handleFileRejections = async (fileRejections: FileRejection[]) => {
    if (fileRejections.length) {
      const { errors } = fileRejections[0]
      const invalidType = errors.find((error) => error.code === 'file-invalid-type')
      const invalidSize = errors.find((error) => error.code === 'file-too-large')
      invalidSize && setFileSelectError(invalidSize.message)
      invalidType && setFileSelectError(invalidType.message)
    }
  }

  const handleCropImage = (imageUrl: string | null, blob?: Blob) => {
    const hasImage = croppedImageUrls.some((item) => item.id === selectedVideoTab?.id)
    if (hasImage) {
      const newImages = croppedImageUrls.map((item) => {
        if (item.id === selectedVideoTab?.id) {
          return { ...item, url: imageUrl }
        }
        return item
      })
      setCroppedImageUrls(newImages)
    } else {
      setCroppedImageUrls([...croppedImageUrls, { id: selectedVideoTab?.id, url: imageUrl }])
    }

    setThumbnail({
      blob: blob || null,
      url: imageUrl,
    })
  }

  const currentVideoDraft = files.find((f) => f.id === selectedVideoTab?.id) || {
    id: selectedVideoTab?.id,
    files: {
      video: null,
      image: null,
    },
  }

  const currentCroppedImgUrl = croppedImageUrls.find((item) => item.id === selectedVideoTab?.id)?.url || null

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

  const handleDeleteFile = (fileType: FileType) => {
    setFiles(
      files.map((f) => {
        if (f.id === selectedVideoTab?.id) {
          return { ...f, files: { ...f.files, [fileType]: null } }
        }
        return f
      })
    )
  }

  // todo handle updating video
  const newVideo = true

  return (
    <>
      <TransactionDialog
        status={transactionStatus}
        successTitle={newVideo ? 'Video successfully created!' : 'Video successfully updated!'}
        successDescription={
          newVideo
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
        <Content>
          <MultiFileSelect
            onDeleteFile={handleDeleteFile}
            files={currentVideoDraft.files}
            error={fileSelectError}
            onError={setFileSelectError}
            onDropRejected={handleFileRejections}
            onChangeFiles={handleChangeFiles}
            croppedImageUrl={currentCroppedImgUrl}
            onCropImage={handleCropImage}
          />
          <EditVideoForm selectedVideoTab={selectedVideoTab} onSubmit={handleSubmit} />
        </Content>
      </Container>
    </>
  )
}
