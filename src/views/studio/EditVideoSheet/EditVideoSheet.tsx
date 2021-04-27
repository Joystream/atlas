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
import { useCategories, useMembership, useQueryNodeStateSubscription } from '@/api/hooks'
import { TransactionDialog } from '@/components'
import { computeFileHash } from '@/utils/hashing'

type Asset = {
  url: string | null
  blob: Blob | null
}

type VideoAsset = {
  duration?: number
  mediaPixelWidth?: number
  mediaPixelHeight?: number
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

  const { categories, error: categoriesError } = useCategories()

  const [transactionStatus, setTransactionStatus] = useState<ExtrinsicStatus | null>(null)
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

  const { refetch: refetchMember } = useMembership(
    {
      where: { id: memberId },
    },
    { skip: !memberId }
  )

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
  const handleFileRejections = (fileRejections: FileRejection[]) => {
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
      isPublic: 'public',
      language: 'en',
      category: null,
      description: '',
      hasMarketing: false,
      publishedBeforeJoystream: null,
      isExplicit: null,
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
    if (!video.url || !video.blob || !thumbnail.blob || !thumbnail.url) {
      setFileSelectError('video or thumbnail was not provided')
      return
    }
    if (!joystream || !memberId || !channelId) {
      return
    }
    // todo create metadata

    const metadata: CreateVideoMetadata = {
      ...(data.title ? { title: data.title ?? '' } : {}),
      ...(data.description ? { description: data.description ?? '' } : {}),
      ...(data.category ? { category: Number(data.category) ?? undefined } : {}),
      ...(data.isPublic ? { isPublic: data.isPublic === 'true' } : {}),
      ...(data.hasMarketing ? { hasMarketing: data.hasMarketing || undefined } : {}),
      ...(data.isExplicit ? { isExplicit: data.isExplicit || undefined } : {}),
      // todo cannot set video.duration, getting "Assertion failed"
      // ...(video.duration ? { duration: video.duration || undefined } : {}),
      ...(video.mediaPixelHeight ? { mediaPixelHeight: video.mediaPixelHeight } : {}),
      ...(video.mediaPixelWidth ? { mediaPixelWidth: video.mediaPixelWidth } : {}),
      // todo publishedBeforeJoystream
    }

    setTransactionStatus(ExtrinsicStatus.ProcessingAssets)

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
      const { data: newVideoId, block } = await joystream.createVideo(
        memberId,
        channelId,
        metadata,
        assets,
        (status) => {
          console.log(assets)
          setTransactionStatus(status)
        }
      )
      assetsOwner = newVideoId

      setTransactionStatus(ExtrinsicStatus.Syncing)
      setTransactionBlock(block)
      setTransactionCallback(() => async () => {
        await refetchMember()
      })

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
        // displaySnackbar({ title: 'Transaction signing cancelled', iconType: 'info' })
      } else {
        console.error(e)
        setTransactionStatus(ExtrinsicStatus.Error)
      }
    }
  })

  const resetFields = (video: VideoDraft | null) => ({
    title: video?.title,
    description: video?.description,
    isPublic: video?.isPublic === undefined ? null : video.isPublic ? 'public' : 'unlisted',
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
    const hasFiles = files.some((f) => f.id === selectedVideoTab?.id)
    const draft = drafts.find((draft) => draft.id === selectedVideoTab?.id)
    if (draft?.title === 'New Draft') {
      await updateDraft(draft.id, { title: changeFiles.video?.name })
      reset(resetFields(draft))
    }
    if (hasFiles) {
      const newFiles = files.map((f) => {
        if (f.id === selectedVideoTab?.id) {
          return { ...f, ...changeFiles }
        }
        return f
      })
      setFiles(newFiles)
    } else {
      setFiles([...files, { id: selectedVideoTab?.id, files: changeFiles }])
    }

    if (changeFiles.video) {
      const fileToBlob = async (file: File) => new Blob([new Uint8Array(await file.arrayBuffer())], { type: file.type })

      const url = URL.createObjectURL(changeFiles.video)
      const videoEl = document.createElement('video')
      videoEl.src = url

      videoEl.preload = 'metadata'

      videoEl.onloadedmetadata = () => {
        window.URL.revokeObjectURL(videoEl.src)
        const mediaPixelHeight = videoEl.videoHeight
        const mediaPixelWidth = videoEl.videoWidth
        const duration = videoEl.duration
        setVideo((video) => ({ ...video, duration, mediaPixelHeight, mediaPixelWidth }))
      }
      const blob = await fileToBlob(changeFiles.video)
      setVideo((video) => ({ ...video, blob, url }))
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

  const currentFilesWithDraftId = files.find((f) => f.id === selectedVideoTab?.id) || {
    draftId: selectedVideoTab?.id,
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
      // todo, temporary. do something here
      setTransactionStatus(null)
    }
    setTransactionStatus(null)
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
            files={currentFilesWithDraftId.files}
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
