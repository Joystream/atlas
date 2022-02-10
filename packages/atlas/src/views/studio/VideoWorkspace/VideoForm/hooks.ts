import { useCallback, useEffect, useMemo, useState } from 'react'
import { FieldNamesMarkedBoolean, UseFormGetValues, UseFormSetValue, UseFormWatch } from 'react-hook-form'

import { ImageInputFile, VideoInputFile } from '@/components/_inputs/MultiFileSelect'
import { useAssetStore, useRawAsset } from '@/providers/assets'
import { VideoWorkspaceVideoFormFields, useVideoWorkspaceData } from '@/providers/videoWorkspace'
import { createId } from '@/utils/createId'
import { computeFileHash } from '@/utils/hashing'

export const useVideoFormAssets = (
  watch: UseFormWatch<VideoWorkspaceVideoFormFields>,
  getValues: UseFormGetValues<VideoWorkspaceVideoFormFields>,
  setValue: UseFormSetValue<VideoWorkspaceVideoFormFields>,
  dirtyFields: FieldNamesMarkedBoolean<VideoWorkspaceVideoFormFields>,
  setHasUnsavedAssets: (hasUnsavedAssets: boolean) => void
) => {
  const [thumbnailHashPromise, setThumbnailHashPromise] = useState<Promise<string> | null>(null)
  const [videoHashPromise, setVideoHashPromise] = useState<Promise<string> | null>(null)

  const { tabData } = useVideoWorkspaceData()

  const addAsset = useAssetStore((state) => state.actions.addAsset)

  const mediaAsset = useRawAsset(watch('assets.video.id') || tabData?.assets.video.id || null)
  const thumbnailAsset = useRawAsset(watch('assets.thumbnail.cropId') || tabData?.assets.thumbnail.originalId || null)
  const originalThumbnailAsset = useRawAsset(
    watch('assets.thumbnail.originalId') || tabData?.assets.thumbnail.cropId || null
  )

  const hasUnsavedAssets = dirtyFields.assets?.video?.id || dirtyFields.assets?.thumbnail?.cropId || false

  // send update to VideoWorkspace when hasUnsavedAssets changes
  useEffect(() => {
    setHasUnsavedAssets(hasUnsavedAssets)
  }, [setHasUnsavedAssets, hasUnsavedAssets])

  const computeMediaHash = useCallback((file: Blob) => {
    const hashPromise = computeFileHash(file)
    setVideoHashPromise(hashPromise)
  }, [])

  const computeThumbnailHash = useCallback((file: Blob) => {
    const hashPromise = computeFileHash(file)
    setThumbnailHashPromise(hashPromise)
  }, [])

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

      if (video?.blob) {
        computeMediaHash(video.blob)
      }
    },
    [addAsset, computeMediaHash, getValues, setValue]
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
        cropId: newCropAssetId,
        originalId: newOriginalAssetId,
        ...thumbnail,
      }
      const updatedAssets = {
        ...currentAssetsValue,
        thumbnail: updatedThumbnail,
      }
      setValue('assets', updatedAssets, { shouldDirty: true })

      if (thumbnail?.blob) {
        computeThumbnailHash(thumbnail.blob)
      }
    },
    [addAsset, computeThumbnailHash, getValues, setValue]
  )

  const files = useMemo(
    () => ({
      video: mediaAsset,
      thumbnail: { ...thumbnailAsset, originalBlob: originalThumbnailAsset?.blob },
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
  }
}
