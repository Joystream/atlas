import { formatISO, isValid as isDateValid } from 'date-fns'
import { debounce } from 'lodash-es'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { DeepPartial, FieldNamesMarkedBoolean, UseFormGetValues, UseFormSetValue, UseFormWatch } from 'react-hook-form'

import { ImageInputFile, VideoInputFile } from '@/components/_inputs/MultiFileSelect'
import { useAssetStore, useRawAsset } from '@/providers/assets'
import { RawDraft, useDraftStore } from '@/providers/drafts'
import { useAuthorizedUser } from '@/providers/user'
import {
  VideoWorkspace,
  VideoWorkspaceVideoFormFields,
  useVideoWorkspace,
  useVideoWorkspaceData,
} from '@/providers/videoWorkspace'
import { createId } from '@/utils/createId'
import { computeFileHash } from '@/utils/hashing'

export const useVideoFormAssets = (
  watch: UseFormWatch<VideoWorkspaceVideoFormFields>,
  getValues: UseFormGetValues<VideoWorkspaceVideoFormFields>,
  setValue: UseFormSetValue<VideoWorkspaceVideoFormFields>,
  dirtyFields: FieldNamesMarkedBoolean<VideoWorkspaceVideoFormFields>
) => {
  const [thumbnailHashPromise, setThumbnailHashPromise] = useState<Promise<string> | null>(null)
  const [videoHashPromise, setVideoHashPromise] = useState<Promise<string> | null>(null)

  const { tabData } = useVideoWorkspaceData()

  const addAsset = useAssetStore((state) => state.actions.addAsset)
  const assets = watch('assets')
  const mediaAsset = useRawAsset(assets?.video.id || tabData?.assets.video.id || null)
  const thumbnailAsset = useRawAsset(assets?.thumbnail.cropId || null)
  const originalThumbnailAsset = useRawAsset(assets?.thumbnail.originalId || null)

  const hasUnsavedAssets = dirtyFields.assets?.video?.id || dirtyFields.assets?.thumbnail?.cropId || false

  const computeMediaHash = useCallback((file: Blob) => {
    const hashPromise = computeFileHash(file)
    setVideoHashPromise(hashPromise)
  }, [])

  const computeThumbnailHash = useCallback((file: Blob) => {
    const hashPromise = computeFileHash(file)
    setThumbnailHashPromise(hashPromise)
  }, [])

  useEffect(() => {
    if (!thumbnailAsset) {
      return
    }
    if (thumbnailAsset?.blob) {
      computeThumbnailHash(thumbnailAsset.blob)
    }
  }, [computeThumbnailHash, thumbnailAsset])

  useEffect(() => {
    if (!mediaAsset) {
      return
    }
    if (mediaAsset?.blob) {
      computeMediaHash(mediaAsset.blob)
    }
  }, [computeMediaHash, mediaAsset])

  const handleVideoFileChange = useCallback(
    (video: VideoInputFile | null) => {
      const currentAssetsValue = getValues('assets')

      if (!video) {
        setValue('assets', { ...currentAssetsValue, video: { id: null } }, { shouldDirty: true })
        return
      }

      const newAssetId = `local-video-${createId()}`
      addAsset(newAssetId, { url: video.url, blob: video.blob })

      const updatedVideo = {
        id: newAssetId,
        ...video,
      }
      const updatedAssets = {
        ...currentAssetsValue,
        video: updatedVideo,
      }
      setValue('assets', updatedAssets, { shouldDirty: true })
    },
    [addAsset, getValues, setValue]
  )

  const handleThumbnailFileChange = useCallback(
    (thumbnail: ImageInputFile | null) => {
      const currentAssetsValue = getValues('assets')

      if (!thumbnail) {
        setValue(
          'assets',
          { ...currentAssetsValue, thumbnail: { cropId: null, originalId: null } },
          { shouldDirty: true }
        )
        return
      }

      const newCropAssetId = `local-thumbnail-crop-${createId()}`
      addAsset(newCropAssetId, { url: thumbnail.url, blob: thumbnail.blob })
      const newOriginalAssetId = `local-thumbnail-original-${createId()}`
      addAsset(newOriginalAssetId, { blob: thumbnail.originalBlob })

      const updatedThumbnail = {
        ...thumbnail,
        cropId: newCropAssetId,
        originalId: newOriginalAssetId,
      }
      const updatedAssets = {
        ...currentAssetsValue,
        thumbnail: updatedThumbnail,
      }
      setValue('assets', updatedAssets, { shouldDirty: true })
    },
    [addAsset, getValues, setValue]
  )

  const files = useMemo(
    () => ({
      video: mediaAsset,
      thumbnail: {
        ...thumbnailAsset,
        ...(originalThumbnailAsset?.blob ? { originalBlob: originalThumbnailAsset?.blob } : {}),
      },
    }),
    [mediaAsset, originalThumbnailAsset?.blob, thumbnailAsset]
  )

  return {
    handleVideoFileChange,
    handleThumbnailFileChange,
    mediaAsset,
    thumbnailAsset,
    files,
    thumbnailHashPromise,
    videoHashPromise,
    hasUnsavedAssets,
  }
}

export const useVideoFormDraft = (
  watch: UseFormWatch<VideoWorkspaceVideoFormFields>,
  dirtyFields: FieldNamesMarkedBoolean<VideoWorkspaceVideoFormFields>
) => {
  const { activeChannelId } = useAuthorizedUser()
  const { editedVideoInfo, setEditedVideo } = useVideoWorkspace()
  const { updateDraft, addDraft } = useDraftStore((state) => state.actions)

  // we pass the functions explicitly so the debounced function doesn't need to change when those functions change
  const debouncedDraftSave = useRef(
    debounce(
      (
        channelId: string,
        tab: VideoWorkspace,
        data: DeepPartial<VideoWorkspaceVideoFormFields>,
        addDraftFn: typeof addDraft,
        updateDraftFn: typeof updateDraft,
        updateSelectedTabFn: typeof setEditedVideo
      ) => {
        const draftData: RawDraft = {
          ...data,
          channelId: activeChannelId,
          type: 'video',
          publishedBeforeJoystream: isDateValid(data.publishedBeforeJoystream)
            ? formatISO(data.publishedBeforeJoystream as Date)
            : null,
        }
        if (tab.isNew) {
          addDraftFn(draftData, tab.id)
          updateSelectedTabFn({ ...tab, isNew: false })
        } else {
          updateDraftFn(tab.id, draftData)
        }
      },
      700
    )
  )

  // save draft on form fields update
  useEffect(() => {
    if (!editedVideoInfo?.isDraft) {
      return
    }

    const subscription = watch((data) => {
      if (!Object.keys(dirtyFields).length) {
        return
      }

      debouncedDraftSave.current(activeChannelId, editedVideoInfo, data, addDraft, updateDraft, setEditedVideo)
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [addDraft, dirtyFields, editedVideoInfo, updateDraft, setEditedVideo, watch, activeChannelId])

  const flushDraftSave = useCallback(() => {
    debouncedDraftSave.current.flush()
  }, [])

  return { flushDraftSave }
}
