import React, { useCallback, useEffect, useState } from 'react'
import { FileRejection } from 'react-dropzone'
import { useForm } from 'react-hook-form'
import { FileState } from '@/shared/components/MultiFileSelect/MultiFileSelect'
import { MultiFileSelect } from '@/shared/components'
import { textFieldValidation } from '@/utils/formValidationOptions'
import {
  EditVideoSheetState,
  EditVideoSheetTab,
  useDrafts,
  VideoDraft,
  useEditVideoSheet,
  useOverlayManager,
  useActiveUser,
  useJoystream,
  useUploadsManager,
  useSnackbar,
} from '@/hooks'
import { Container, Content, DrawerOverlay, StyledActionBar } from './EditVideoSheet.style'
import { useEditVideoSheetAnimations } from './animations'
import { EditVideoTabsBar } from './EditVideoTabsBar'
import { EditVideoForm, FormInputs } from './EditVideoForm'
import { SvgGlyphInfo } from '@/shared/icons'
import {
  CreateVideoMetadata,
  ExtrinsicStatus,
  VideoAssets,
  ExtensionSignCancelledError,
  VideoId,
} from '@/joystream-lib'
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
  // sheet state
  const {
    sheetState,
    setSheetState,
    videoTabs,
    addVideoTab,
    removeVideoTab,
    resetVideoTabs,
    selectedVideoTab,
    setSelectedVideoTab,
  } = useEditVideoSheet()

  const [transactionStatus, setTransactionStatus] = useState<ExtrinsicStatus | null>(null)
  const { displaySnackbar } = useSnackbar()
  const [transactionBlock, setTransactionBlock] = useState<number | null>(null)
  const [transactionCallback, setTransactionCallback] = useState<(() => void) | null>(null)
  const [thumbnailHashPromise, setThumbnailHashPromise] = useState<Promise<string> | null>(null)
  const [videoHashPromise, setVideoHashPromise] = useState<Promise<string> | null>(null)
  const [video, setVideo] = useState<VideoAsset>({
    url: null,
    blob: null,
  })
  const [thumbnail, setThumbnail] = useState<Asset>({
    url: null,
    blob: null,
  })
  const {
    activeUser: { channelId, memberId },
  } = useActiveUser()

  const { queryNodeState } = useQueryNodeStateSubscription({ skip: transactionStatus !== ExtrinsicStatus.Syncing })

  const { startFileUpload } = useUploadsManager(channelId || '')
  const { joystream } = useJoystream()

  const { lockScroll, unlockScroll } = useOverlayManager()
  const [cachedSheetState, setCachedSheetState] = useState<EditVideoSheetState>('closed')
  const { drawerOverlayAnimationProps, sheetAnimationProps } = useEditVideoSheetAnimations(sheetState)

  // forms state
  const [fileSelectError, setFileSelectError] = useState<string | null>(null)
  const [files, setFiles] = useState<FileStateWithDraftId[]>([])
  const [croppedImageUrls, setCroppedImageUrls] = useState<CroppedImageUrlsWithDraftId[]>([])
  const handleFileRejections = async (fileRejections: FileRejection[]) => {
    if (fileRejections.length) {
      const { errors } = fileRejections[0]
      const invalidType = errors.find((error) => error.code === 'file-invalid-type')
      const invalidSize = errors.find((error) => error.code === 'file-too-large')
      invalidSize && setFileSelectError(invalidSize.message)
      invalidType && setFileSelectError(invalidType.message)
    }
  }
  const {
    register,
    control,
    setValue: setFormValue,
    handleSubmit: createSubmitHandler,
    reset,
    clearErrors,
    errors,
  } = useForm<FormInputs>({
    shouldFocusError: true,
    defaultValues: {
      title: '',
      isPublic: false,
      language: 'en',
      category: null,
      description: '',
      hasMarketing: false,
      publishedBeforeJoystream: null,
      isExplicit: false,
    },
  })

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
      transactionCallback?.()
    }
  }, [queryNodeState, transactionBlock, transactionCallback, transactionStatus])

  const handleSubmit = createSubmitHandler(async (data) => {
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
    let assetsOwner: VideoId = ''

    try {
      const { block } = await joystream.createVideo(memberId, channelId, metadata, assets, (status) => {
        setTransactionStatus(status)
      })
      assetsOwner = channelId

      setTransactionStatus(ExtrinsicStatus.Syncing)
      setTransactionBlock(block)

      if (video.blob && videoContentId) {
        startFileUpload(video.blob, {
          contentId: videoContentId,
          owner: assetsOwner,
          parentObject: {
            type: 'video',
            id: assetsOwner,
          },
          type: 'video',
        })
      }
      if (thumbnail.blob && thumbnailContentId) {
        startFileUpload(thumbnail.blob, {
          contentId: thumbnailContentId,
          owner: assetsOwner,
          parentObject: {
            type: 'video',
            id: assetsOwner,
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
  })

  const resetFields = (video: VideoDraft | null) => ({
    title: video?.title,
    description: video?.description,
    isPublic: null,
    language: video?.language ?? null,
    category: video?.categoryId ?? null,
    hasMarketing: video?.hasMarketing ?? null,
    publishedBeforeJoystream: video?.publishedBeforeJoystream ?? '',
  })

  // Tabs
  const { addDraft, drafts, updateDraft, removeDraft } = useDrafts('video', channelId || '')

  const selectTab = useCallback(
    async (tab: EditVideoSheetTab) => {
      const currentDraft = drafts.find((draft) => draft.id === tab.id)
      currentDraft && reset(resetFields(currentDraft))
      setSelectedVideoTab(tab)
    },
    [drafts, reset, setSelectedVideoTab]
  )

  const addNewTab = useCallback(async () => {
    const newDraft = await addDraft({
      channelId: channelId || '',
      title: 'New Draft',
    })
    addVideoTab(newDraft)
    if (!videoTabs.length) {
      setSelectedVideoTab(newDraft)
      reset(resetFields(newDraft))
    }
  }, [addDraft, channelId, addVideoTab, videoTabs.length, setSelectedVideoTab, reset])

  useEffect(() => {
    if (sheetState === cachedSheetState) {
      return
    }
    setCachedSheetState(sheetState)

    if (sheetState === 'open') {
      selectedVideoTab && reset(resetFields(selectedVideoTab))
      if (videoTabs.length === 0) {
        addNewTab()
      }
      lockScroll()
    }
    if (sheetState === 'closed' || sheetState === 'minimized') {
      unlockScroll()
    }
  }, [sheetState, cachedSheetState, videoTabs.length, addNewTab, lockScroll, unlockScroll, reset, selectedVideoTab])

  useEffect(() => {
    if (sheetState === 'closed') {
      return
    }
    const beforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = 'Do you want to leave this page? Changes that you made may not be saved.'
    }
    window.addEventListener('beforeunload', beforeUnload)
    return () => {
      window.removeEventListener('beforeunload', beforeUnload)
    }
  }, [sheetState])

  const toggleMinimizedSheet = () => {
    setSheetState(sheetState === 'open' ? 'minimized' : 'open')
  }

  const closeSheet = () => {
    resetVideoTabs()
    setSheetState('closed')
  }

  const removeTab = (tab: EditVideoSheetTab) => {
    const newTab = videoTabs.find((currentTab) => currentTab.id !== tab.id)
    newTab ? selectedVideoTab?.id === tab.id && selectTab(newTab) : closeSheet()
    removeVideoTab(tab)
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
        await updateDraft(draft.id, { title: changeFiles.video?.name })
        reset(resetFields(draft))
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

  const videoTabsWithTitle = videoTabs
    .map((tab) => {
      const draft = drafts.find((draft) => draft.id === tab.id)
      if (draft) {
        return { ...tab, title: draft.title }
      }
      return { ...tab }
    })
    .filter((tab) => tab.title !== undefined)

  const handleTransactionClose = async () => {
    if (transactionStatus === ExtrinsicStatus.Completed) {
      if (selectedVideoTab?.id) {
        removeDraft(selectedVideoTab?.id)
      }
      setTransactionStatus(null)
      closeSheet()
      reset()
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
          videoTabs={videoTabsWithTitle}
          selectedVideoTab={selectedVideoTab}
          onAddNewTabClick={addNewTab}
          onRemoveTabClick={removeTab}
          onTabSelect={selectTab}
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
          <EditVideoForm
            control={control}
            titleRef={register(textFieldValidation('Video Title', 3, 20))}
            descriptionRef={register(textFieldValidation('Description', 0, 2160))}
            errors={errors}
            clearErrors={clearErrors}
            setFormValue={setFormValue}
            draftId={selectedVideoTab?.id}
          />
        </Content>
        <StyledActionBar
          fee={99}
          primaryButtonText="Publish video"
          onConfirmClick={handleSubmit}
          detailsText="Drafts are saved automatically"
          tooltipText="Drafts system can only store video metadata. Selected files (video, thumbnail) will not be saved as part of the draft."
          detailsTextIcon={<SvgGlyphInfo />}
        />
      </Container>
    </>
  )
}
