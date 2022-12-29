import { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useBasicVideo } from '@/api/hooks/video'
import { SvgActionAdd } from '@/assets/icons'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Button } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { ImageUploadAndCrop } from '@/components/_inputs/ImageUploadAndCrop/ImageUploadAndCrop'
import { ImageInputFile, ImageInputMetadata } from '@/components/_inputs/MultiFileSelect'
import { OptionCardGroupRadio } from '@/components/_inputs/OptionCardGroup'
import { TextArea } from '@/components/_inputs/TextArea'
import { TitleInput } from '@/components/_inputs/TitleInput'
import { BottomDrawer } from '@/components/_overlays/BottomDrawer'
import { VideoTileViewer } from '@/components/_video/VideoTileViewer'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useAsset, useRawAsset } from '@/providers/assets/assets.hooks'
import { useAssetStore } from '@/providers/assets/assets.store'
import { createId } from '@/utils/createId'
import { computeFileHash } from '@/utils/hashing'
import { SentryLogger } from '@/utils/logs'
import { VideoSelectorDialog } from '@/views/studio/PlaylistWorkspace/VideoSelectorDialog/VideoSelectorDialog'

import { FormWrapper, WorkspaceWrapper } from './PlaylistWorkspace.styles'

type PlaylistWorkspaceFormFields = {
  title: string
  description: string
  isPublic: boolean
  thumbnail: {
    cropId: string | null
    originalId: string | null
    originalBlob?: {
      name?: string
    } | null
  } & ImageInputMetadata
}

const formOptions = [
  {
    value: true,
    label: 'Public',
    caption: 'Visible to all',
  },
  {
    value: false,
    label: 'Unlisted',
    caption: 'Visible only with link',
  },
]

export const PlaylistWorkspace = () => {
  const [playlistVideos, setPlaylistVideos] = useState<string[]>([])
  const mdMatch = useMediaMatch('md')
  const addAsset = useAssetStore((state) => state.actions.addAsset)
  const [thumbnailHashPromise, setThumbnailHashPromise] = useState<Promise<string> | null>(null)
  const [show, setShow] = useState(true)
  const [shouldFallbackThumbnail, setShouldFallbackThumbnail] = useState(true)

  const {
    control,
    handleSubmit: createSubmitHandler,
    getValues,
    setValue,
    trigger,
    watch,
    formState: { dirtyFields },
  } = useForm<PlaylistWorkspaceFormFields>({
    shouldFocusError: true,
    defaultValues: {
      isPublic: true,
    },
  })
  const thumbnail = watch('thumbnail')
  const { video } = useBasicVideo(playlistVideos[0] ?? '', {
    skip: !playlistVideos[0] || !!thumbnail?.cropId,
    onError: (error) => SentryLogger.error('Failed to fetch video', 'VideoTile', error, { video: { id } }),
  })
  const { url: thumbnailPhotoUrl, isLoadingAsset: isLoadingThumbnail } = useAsset(video?.thumbnailPhoto)

  // const hasUnsavedAssets = dirtyFields.thumbnail?.cropId || false
  const thumbnailAsset = useRawAsset(thumbnail?.cropId || null)
  const originalThumbnailAsset = useRawAsset(thumbnail?.originalId || null)
  const firstVideoAsset = useRawAsset(video?.thumbnailPhoto?.id || null)

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
  console.log(video, !playlistVideos[0] || !!thumbnail?.cropId)
  useEffect(() => {
    console.log('check', thumbnail, video)
    if (!thumbnail?.cropId && video && shouldFallbackThumbnail) {
      setShouldFallbackThumbnail(false)
      const currentThumbnailValue = getValues('thumbnail')
      setValue(
        'thumbnail',
        {
          ...currentThumbnailValue,
          ...{ cropId: video.thumbnailPhoto?.id ?? null, originalId: null, url: thumbnailPhotoUrl },
        },
        { shouldDirty: true }
      )
    }
  }, [video, thumbnail, getValues, setValue, thumbnailPhotoUrl])

  const handleThumbnailFileChange = (file: ImageInputFile | null) => {
    const currentThumbnailValue = getValues('thumbnail')
    if (!file) {
      if (video) {
        setValue(
          'thumbnail',
          {
            ...currentThumbnailValue,
            ...{ cropId: video.thumbnailPhoto?.id ?? null, originalId: null, url: thumbnailPhotoUrl },
          },
          { shouldDirty: true }
        )
      }
      setValue('thumbnail', { ...currentThumbnailValue, ...{ cropId: null, originalId: null } }, { shouldDirty: true })
      return
    }
    setShouldFallbackThumbnail(true)
    const newCropAssetId = `local-thumbnail-crop-${createId()}`
    addAsset(newCropAssetId, { url: file.url, blob: file.blob })
    const newOriginalAssetId = `local-thumbnail-original-${createId()}`
    addAsset(newOriginalAssetId, { blob: file.originalBlob })

    const updatedThumbnail = {
      ...file,
      cropId: newCropAssetId,
      originalId: newOriginalAssetId,
      originalBlob: {
        name: (file.originalBlob as File).name,
      },
    }
    setValue('thumbnail', updatedThumbnail, { shouldDirty: true })
    trigger('thumbnail')
  }

  return (
    <>
      <VideoSelectorDialog show={show} onHide={() => setShow(false)} onSelect={setPlaylistVideos} />
      <BottomDrawer
        isOpen={true}
        onClose={() => alert('close')}
        title="New playlist"
        pageTitle="New playlist"
        titleLabel="Playlist"
      >
        <WorkspaceWrapper as="form">
          <FormWrapper>
            <ImageUploadAndCrop
              editMode
              file={{
                // url: formValues.thumbnail.
                ...thumbnailAsset,
                ...(originalThumbnailAsset?.blob ? { originalBlob: originalThumbnailAsset?.blob } : {}),
              }}
              onImageChange={handleThumbnailFileChange}
            />

            <Controller
              name="title"
              control={control}
              rules={{
                minLength: {
                  value: 5,
                  // value: MIN_TITLE_LENGTH,
                  message: 'Enter a valid playlist title.',
                },
                required: {
                  value: true,
                  message: 'Enter a playlist title.',
                },
              }}
              render={({ field: { value, ref, onChange }, fieldState: { error } }) => (
                <FormField error={error?.message}>
                  <TitleInput ref={ref} value={value} onChange={onChange} placeholder="Enter playlist title" />
                </FormField>
              )}
            />
            <Controller
              name="description"
              control={control}
              rules={{
                required: {
                  value: true,
                  message: 'Enter a playlist description.',
                },
              }}
              render={({ field: { value, ref, onChange }, fieldState: { error } }) => (
                <FormField error={error?.message}>
                  <TextArea ref={ref} value={value} onChange={onChange} placeholder="No description" />
                </FormField>
              )}
            />
            <Controller
              name="isPublic"
              control={control}
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <FormField error={error?.message}>
                  <OptionCardGroupRadio
                    onChange={onChange}
                    selectedValue={value}
                    options={formOptions}
                    direction={mdMatch ? 'horizontal' : 'vertical'}
                  />
                </FormField>
              )}
            />
          </FormWrapper>
          {playlistVideos.length ? (
            playlistVideos.map((videoId) => <VideoTileViewer direction="horizontal" key={videoId} id={videoId} />)
          ) : (
            <EmptyFallback
              title="No videos in the playlist yet"
              subtitle="Add your videos to the playlist and let people enjoy your videos!"
              button={
                <Button onClick={() => setShow(true)} variant="primary" icon={<SvgActionAdd />} iconPlacement="right">
                  Add videos
                </Button>
              }
            />
          )}
        </WorkspaceWrapper>
      </BottomDrawer>
    </>
  )
}
