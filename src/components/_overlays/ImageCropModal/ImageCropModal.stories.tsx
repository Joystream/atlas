import styled from '@emotion/styled/'
import { Meta, Story } from '@storybook/react'
import React, { useRef, useState } from 'react'

import { Avatar } from '@/components/Avatar'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { OverlayManagerProvider } from '@/providers/overlayManager'
import { AssetDimensions, ImageCropData } from '@/types/cropper'

import { ImageCropModal, ImageCropModalImperativeHandle, ImageCropModalProps } from './ImageCropModal'

export default {
  title: 'overlays/ImageCropModal',
  component: ImageCropModal,
  argTypes: {
    showDialog: { table: { disable: true } },
    imageType: { table: { disable: true } },
  },
  decorators: [
    (Story) => (
      <OverlayManagerProvider>
        <Story />
      </OverlayManagerProvider>
    ),
  ],
} as Meta

const RegularTemplate: Story<ImageCropModalProps> = () => {
  const avatarDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const thumbnailDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const coverDialogRef = useRef<ImageCropModalImperativeHandle>(null)
  const [avatarImageUrl, setAvatarImageUrl] = useState<string | null>(null)
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)

  const handleAvatarConfirm = (
    blob: Blob,
    url: string,
    _assetDimensions: AssetDimensions,
    _imageCropData: ImageCropData
  ) => {
    setAvatarImageUrl(url)
  }

  const handleThumbnailConfirm = (
    blob: Blob,
    url: string,
    _assetDimensions: AssetDimensions,
    _imageCropData: ImageCropData
  ) => {
    setThumbnailImageUrl(url)
  }

  const handleCoverConfirm = (
    blob: Blob,
    url: string,
    _assetDimensions: AssetDimensions,
    _imageCropData: ImageCropData
  ) => {
    setCoverImageUrl(url)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '24px' }}>
      <Avatar assetUrl={avatarImageUrl} editable onEditClick={() => avatarDialogRef.current?.open()} size="cover" />

      {thumbnailImageUrl ? (
        <Image src={thumbnailImageUrl} onClick={() => thumbnailDialogRef.current?.open()} />
      ) : (
        <ImageSkeletonLoader onClick={() => thumbnailDialogRef.current?.open()} />
      )}
      {coverImageUrl ? (
        <Image src={coverImageUrl} onClick={() => coverDialogRef.current?.open()} />
      ) : (
        <ImageSkeletonLoader onClick={() => coverDialogRef.current?.open()} />
      )}

      <ImageCropModal imageType="avatar" onConfirm={handleAvatarConfirm} ref={avatarDialogRef} />
      <ImageCropModal imageType="videoThumbnail" onConfirm={handleThumbnailConfirm} ref={thumbnailDialogRef} />
      <ImageCropModal imageType="cover" onConfirm={handleCoverConfirm} ref={coverDialogRef} />
    </div>
  )
}
export const Regular = RegularTemplate.bind({})

const ImageSkeletonLoader = styled(SkeletonLoader)`
  width: 600px;
  min-height: 200px;
  cursor: pointer;
`

const Image = styled.img`
  width: 600px;
  cursor: pointer;
`
