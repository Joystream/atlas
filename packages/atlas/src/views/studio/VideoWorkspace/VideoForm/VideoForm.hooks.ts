import { formatISO, isValid as isDateValid } from 'date-fns'
import { debounce } from 'lodash-es'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  DeepPartial,
  FieldErrors,
  FieldNamesMarkedBoolean,
  UseFormGetValues,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
} from 'react-hook-form'

import { ImageInputFile, InputFilesState, VideoInputFile } from '@/components/_inputs/MultiFileSelect'
import { RawDraft, useDraftStore } from '@/providers/drafts'
import { useAuthorizedUser } from '@/providers/user/user.hooks'
import {
  VideoWorkspace,
  VideoWorkspaceVideoAssets,
  VideoWorkspaceVideoFormFields,
  useVideoWorkspace,
} from '@/providers/videoWorkspace'
import { SubtitlesInput } from '@/types/subtitles'
import { createId } from '@/utils/createId'
import { computeFileHash } from '@/utils/hashing'
import { capitalizeFirstLetter } from '@/utils/misc'

export const useVideoFormAssets = (
  watch: UseFormWatch<VideoWorkspaceVideoFormFields>,
  getValues: UseFormGetValues<VideoWorkspaceVideoFormFields>,
  setValue: UseFormSetValue<VideoWorkspaceVideoFormFields>,
  dirtyFields: FieldNamesMarkedBoolean<VideoWorkspaceVideoFormFields>,
  trigger: UseFormTrigger<VideoWorkspaceVideoFormFields>,
  errors: FieldErrors<VideoWorkspaceVideoFormFields>
) => {
  const [thumbnailHashPromise, setThumbnailHashPromise] = useState<Promise<string> | null>(null)
  const [videoHashPromise, setVideoHashPromise] = useState<Promise<string> | null>(null)
  const [subtitlesHashesPromises, setSubtitlesHashesPromises] = useState<(Promise<string> | null)[]>([])

  const assets = watch('assets')
  const subtitles = watch('subtitlesArray')
  const mediaAsset = assets?.video.id ? assets?.video : null
  const thumbnailAsset = assets?.thumbnail

  const hasUnsavedAssets = dirtyFields.assets?.video?.id || dirtyFields.assets?.thumbnail?.cropId || false

  const computeMediaHash = useCallback((file: Blob) => {
    const hashPromise = computeFileHash(file)
    setVideoHashPromise(hashPromise)
  }, [])

  const computeThumbnailHash = useCallback((file: Blob) => {
    const hashPromise = computeFileHash(file)
    setThumbnailHashPromise(hashPromise)
  }, [])

  const computeSubtitlesHashes = useCallback((subtitles: SubtitlesInput[]) => {
    const subtitlesHashesPromises = subtitles.map((subtitle) => {
      if (!subtitle.file) {
        return null
      }
      return computeFileHash(subtitle.file)
    })
    setSubtitlesHashesPromises(subtitlesHashesPromises)
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

  useEffect(() => {
    if (!subtitles) {
      return
    }
    computeSubtitlesHashes(subtitles)
  }, [computeSubtitlesHashes, subtitles])

  const handleVideoFileChange = useCallback(
    (video: VideoInputFile | null) => {
      const currentAssetsValue = getValues('assets')
      if (!video) {
        setValue('assets', { ...currentAssetsValue, video: { id: null } }, { shouldDirty: true })
        return
      }
      const newAssetId = `local-video-${createId()}`
      setValue(
        'assets.video',
        {
          ...video,
          id: newAssetId,
          blob: video?.blob as File,
        },
        { shouldDirty: true }
      )

      if (!dirtyFields.title && video?.title) {
        const removedUnnecessaryCharacters = video.title.replace(/\.[^.]+$/, '').replace(/_/g, ' ')
        setValue('title', capitalizeFirstLetter(removedUnnecessaryCharacters), {
          shouldDirty: true,
        })
      }
      if (errors.assets) {
        trigger('assets')
      }
    },
    [dirtyFields.title, errors.assets, getValues, setValue, trigger]
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
      const newOriginalAssetId = `local-thumbnail-original-${createId()}`

      const updatedThumbnail: VideoWorkspaceVideoAssets['thumbnail'] = {
        ...thumbnail,
        blob: thumbnail.blob || undefined,
        cropId: newCropAssetId,
        originalId: newOriginalAssetId,
        originalBlob: thumbnail?.originalBlob || null,
      }
      const updatedAssets: VideoWorkspaceVideoAssets = {
        ...currentAssetsValue,
        thumbnail: updatedThumbnail,
      }
      setValue('assets', updatedAssets, { shouldDirty: true })
      trigger('assets')
    },
    [getValues, setValue, trigger]
  )

  const files = useMemo<InputFilesState>(
    () => ({
      video: mediaAsset,
      thumbnail: { ...thumbnailAsset, originalBlob: null },
    }),
    [mediaAsset, thumbnailAsset]
  )

  return {
    handleVideoFileChange,
    handleThumbnailFileChange,
    mediaAsset,
    thumbnailAsset,
    files,
    thumbnailHashPromise,
    videoHashPromise,
    subtitlesHashesPromises,
    hasUnsavedAssets,
  }
}

export const useVideoFormDraft = (
  watch: UseFormWatch<VideoWorkspaceVideoFormFields>,
  dirtyFields: FieldNamesMarkedBoolean<VideoWorkspaceVideoFormFields>
) => {
  const { channelId } = useAuthorizedUser()
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
          channelId: channelId,
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

      debouncedDraftSave.current(channelId, editedVideoInfo, data, addDraft, updateDraft, setEditedVideo)
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [addDraft, dirtyFields, editedVideoInfo, updateDraft, setEditedVideo, watch, channelId])

  const flushDraftSave = useCallback(() => {
    debouncedDraftSave.current.flush()
  }, [])

  return { flushDraftSave }
}
