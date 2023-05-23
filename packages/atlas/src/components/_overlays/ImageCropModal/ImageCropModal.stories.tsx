import styled from '@emotion/styled'
import { Meta, StoryFn } from '@storybook/react'
import { useRef, useState } from 'react'

import { Avatar } from '@/components/Avatar'
import { Text } from '@/components/Text'
import { OverlayManagerProvider } from '@/providers/overlayManager'
import { cVar } from '@/styles'
import { AssetDimensions, ImageCropData } from '@/types/cropper'

import { ImageCropModal, ImageCropModalImperativeHandle, ImageCropModalProps } from './ImageCropModal'

export default {
  title: 'overlays/ImageCropModal',
  component: ImageCropModal,
  argTypes: {
    imageType: { table: { disable: true } },
    onDelete: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta<ImageCropModalProps>

type ImageData = {
  url: string
  cropData: ImageCropData
  originalBlob: File | Blob | null
}

const RegularTemplate: StoryFn<ImageCropModalProps> = () => {
  const avatarDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const thumbnailDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const coverDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const [avatarImage, setAvatarImage] = useState<ImageData | null>(null)
  const [thumbnailImage, setThumbnailImage] = useState<ImageData | null>(null)
  const [coverImage, setCoverImage] = useState<ImageData | null>(null)

  const handleAvatarConfirm = (
    blob: Blob,
    url: string,
    _assetDimensions: AssetDimensions,
    _imageCropData: ImageCropData,
    originalBlob: File | Blob | null
  ) => {
    setAvatarImage({ url, cropData: _imageCropData, originalBlob })
  }

  const handleThumbnailConfirm = (
    blob: Blob,
    url: string,
    _assetDimensions: AssetDimensions,
    _imageCropData: ImageCropData,
    originalBlob: File | Blob | null
  ) => {
    setThumbnailImage({ url, cropData: _imageCropData, originalBlob })
  }

  const handleCoverConfirm = (
    blob: Blob,
    url: string,
    _assetDimensions: AssetDimensions,
    _imageCropData: ImageCropData,
    originalBlob: File | Blob | null
  ) => {
    setCoverImage({ url, cropData: _imageCropData, originalBlob })
  }

  const handleAvatarDelete = () => {
    setAvatarImage(null)
  }

  const handleThumbnailDelete = () => {
    setThumbnailImage(null)
  }

  const handleCoverDelete = () => {
    setCoverImage(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '24px' }}>
      <Avatar
        assetUrl={avatarImage?.url}
        editable
        onClick={() => avatarDialogRef.current?.open(avatarImage?.originalBlob, avatarImage?.cropData, true)}
        size={88}
      />

      {thumbnailImage ? (
        <Image
          src={thumbnailImage.url}
          onClick={() => thumbnailDialogRef.current?.open(thumbnailImage.originalBlob, thumbnailImage.cropData, true)}
        />
      ) : (
        <Placeholder onClick={() => thumbnailDialogRef.current?.open()}>
          <Text as="p" variant="h200">
            Add thumbnail
          </Text>
        </Placeholder>
      )}
      {coverImage ? (
        <Image
          src={coverImage.url}
          onClick={() => coverDialogRef.current?.open(coverImage.originalBlob, coverImage.cropData, true)}
        />
      ) : (
        <Placeholder onClick={() => coverDialogRef.current?.open()}>
          <Text as="p" variant="h200">
            Add cover
          </Text>
        </Placeholder>
      )}

      <ImageCropModal
        onDelete={avatarImage ? handleAvatarDelete : undefined}
        imageType="avatar"
        onConfirm={handleAvatarConfirm}
        ref={avatarDialogRef}
      />
      <ImageCropModal
        onDelete={thumbnailImage ? handleThumbnailDelete : undefined}
        imageType="videoThumbnail"
        onConfirm={handleThumbnailConfirm}
        ref={thumbnailDialogRef}
      />
      <ImageCropModal
        onDelete={handleCoverDelete}
        imageType="cover"
        onConfirm={handleCoverConfirm}
        ref={coverDialogRef}
      />
    </div>
  )
}
export const Regular = RegularTemplate.bind({})

const Image = styled.img`
  width: 600px;
  cursor: pointer;
`

const Placeholder = styled.div`
  width: 600px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${cVar('colorBackground')};
  cursor: pointer;
  border: 2px dashed ${cVar('colorBorderAlpha')};
`
