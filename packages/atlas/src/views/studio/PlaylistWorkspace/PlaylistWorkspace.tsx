import { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useBasicVideo } from '@/api/hooks/video'
import { SvgActionAdd } from '@/assets/icons'
import { DraggableComponent } from '@/components/DraggableComponent/DraggableComponent'
import { EmptyFallback } from '@/components/EmptyFallback'
import { Button } from '@/components/_buttons/Button'
import { FormField } from '@/components/_inputs/FormField'
import { ImageUploadAndCrop } from '@/components/_inputs/ImageUploadAndCrop/ImageUploadAndCrop'
import { ImageInputFile, ImageInputMetadata } from '@/components/_inputs/MultiFileSelect'
import { OptionCardGroupRadio } from '@/components/_inputs/OptionCardGroup'
import { TextArea } from '@/components/_inputs/TextArea'
import { TitleInput } from '@/components/_inputs/TitleInput'
import { BottomDrawer } from '@/components/_overlays/BottomDrawer'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useAsset, useRawAsset } from '@/providers/assets/assets.hooks'
import { useAssetStore } from '@/providers/assets/assets.store'
import { createId } from '@/utils/createId'
import { computeFileHash } from '@/utils/hashing'
import { SentryLogger } from '@/utils/logs'
import { VideoSelectorDialog } from '@/views/studio/PlaylistWorkspace/VideoSelectorDialog/VideoSelectorDialog'

import { FormWrapper, StyledButton, StyledVideoListItem, WorkspaceWrapper } from './PlaylistWorkspace.styles'

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
// todo: should be transfered to the context later on
export type PlaylistWorkspaceProps = {
  show: boolean
  onHide: () => void
}

export const PlaylistWorkspace = ({ show, onHide }: PlaylistWorkspaceProps) => {
  const [playlistVideos, setPlaylistVideos] = useState<string[]>([])
  const mdMatch = useMediaMatch('md')
  const addAsset = useAssetStore((state) => state.actions.addAsset)
  const [, setThumbnailHashPromise] = useState<Promise<string> | null>(null)
  const [showSelectDialog, setShowSelectDialog] = useState(false)
  const [shouldFallbackThumbnail, setShouldFallbackThumbnail] = useState(true)

  const { control, getValues, setValue, trigger, watch } = useForm<PlaylistWorkspaceFormFields>({
    shouldFocusError: true,
    defaultValues: {
      isPublic: true,
    },
  })
  const thumbnail = watch('thumbnail')
  const { video } = useBasicVideo(playlistVideos[0] ?? '', {
    skip: !playlistVideos[0],
    onError: (error) =>
      SentryLogger.error('Failed to fetch video', 'VideoTile', error, { video: { id: playlistVideos[0] } }),
  })
  const { url: thumbnailPhotoUrl } = useAsset(video?.thumbnailPhoto)

  // const hasUnsavedAssets = dirtyFields.thumbnail?.cropId || false
  const thumbnailAsset = useRawAsset(thumbnail?.cropId || null)
  const originalThumbnailAsset = useRawAsset(thumbnail?.originalId || null)
  // const firstVideoAsset = useRawAsset(video?.thumbnailPhoto?.id || null)

  const computeThumbnailHash = useCallback((file: Blob) => {
    const hashPromise = computeFileHash(file)
    setThumbnailHashPromise(hashPromise)
  }, [])

  const updateFallbackThumbnail = useCallback(() => {
    if (video) {
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
  }, [getValues, setValue, thumbnailPhotoUrl, video])

  useEffect(() => {
    if (!thumbnailAsset) {
      return
    }
    if (thumbnailAsset?.blob) {
      computeThumbnailHash(thumbnailAsset.blob)
    }
  }, [computeThumbnailHash, thumbnailAsset])

  useEffect(() => {
    if (
      video &&
      (!thumbnail?.cropId || (thumbnail.cropId !== video.thumbnailPhoto?.id && !thumbnail.originalId)) &&
      shouldFallbackThumbnail
    ) {
      setShouldFallbackThumbnail(false)
      updateFallbackThumbnail()
    }
  }, [
    video,
    thumbnail,
    getValues,
    setValue,
    thumbnailPhotoUrl,
    shouldFallbackThumbnail,
    updateFallbackThumbnail,
    playlistVideos,
  ])

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

  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
    setShouldFallbackThumbnail(true)
    setPlaylistVideos((prev) => {
      const copy = [...prev]
      copy.splice(dragIndex, 1)
      copy.splice(hoverIndex, 0, prev[dragIndex])
      return copy
    })
  }, [])

  const handleItemRemove = useCallback((videoId: string) => {
    setPlaylistVideos((prev) => prev.filter((vId) => vId !== videoId))
  }, [])

  return (
    <>
      <VideoSelectorDialog
        show={showSelectDialog}
        onHide={() => setShowSelectDialog(false)}
        onSelect={setPlaylistVideos}
        initialSelected={playlistVideos}
      />
      <BottomDrawer isOpen={show} onClose={onHide} title="New playlist" pageTitle="New playlist" titleLabel="Playlist">
        <WorkspaceWrapper as="form">
          <FormWrapper>
            <ImageUploadAndCrop
              editMode
              file={{
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
            <>
              <div>
                {playlistVideos.map((videoId, index) => (
                  <DraggableComponent
                    key={videoId}
                    id={videoId}
                    itemType="videoListItem"
                    index={index}
                    moveItem={moveItem}
                    removeOption={{
                      label: 'Remove from playlist',
                      onClick: () => handleItemRemove(videoId),
                    }}
                  >
                    <StyledVideoListItem id={videoId} variant="large" />
                  </DraggableComponent>
                ))}
              </div>
              <StyledButton
                onClick={() => setShowSelectDialog(true)}
                variant="secondary"
                size="large"
                icon={<SvgActionAdd />}
                iconPlacement="right"
              >
                Add videos
              </StyledButton>
            </>
          ) : (
            <EmptyFallback
              title="No videos in the playlist yet"
              subtitle="Add your videos to the playlist and let people enjoy your videos!"
              button={
                <Button
                  onClick={() => setShowSelectDialog(true)}
                  variant="primary"
                  icon={<SvgActionAdd />}
                  iconPlacement="right"
                >
                  Add videos
                </Button>
              }
            />
          )}
        </WorkspaceWrapper>
        {/*todo: add footer once logic is in place*/}
      </BottomDrawer>
    </>
  )
}
