import { css } from '@emotion/react'
import styled from '@emotion/styled/'
import { Story, Meta } from '@storybook/react'
import React, { useState, useRef } from 'react'

import { OverlayManagerProvider } from '@/hooks'
import { Avatar, Placeholder } from '@/shared/components'
import { ImageCropData, AssetDimensions } from '@/types/cropper'

import ImageCropDialog, { ImageCropDialogImperativeHandle, ImageCropDialogProps } from './ImageCropDialog'

export default {
  title: 'General/ImageCropDialog',
  component: ImageCropDialog,
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

const RegularTemplate: Story<ImageCropDialogProps> = () => {
  const avatarDialogRef = useRef<ImageCropDialogImperativeHandle>(null)
  const thumbnailDialogRef = useRef<ImageCropDialogImperativeHandle>(null)
  const coverDialogRef = useRef<ImageCropDialogImperativeHandle>(null)
  const [avatarImageUrl, setAvatarImageUrl] = useState<string | null>(null)
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<string | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)

  const handleAvatarConfirm = (
    blob: Blob,
    url: string,
    assetDimensions: AssetDimensions,
    imageCropData: ImageCropData
  ) => {
    setAvatarImageUrl(url)
  }

  const handleThumbnailConfirm = (
    blob: Blob,
    url: string,
    assetDimensions: AssetDimensions,
    imageCropData: ImageCropData
  ) => {
    setThumbnailImageUrl(url)
  }

  const handleCoverConfirm = (
    blob: Blob,
    url: string,
    assetDimensions: AssetDimensions,
    imageCropData: ImageCropData
  ) => {
    setCoverImageUrl(url)
  }

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: start;

        > * {
          margin-bottom: 24px !important;
        }
      `}
    >
      <Avatar imageUrl={avatarImageUrl} editable onEditClick={() => avatarDialogRef.current?.open()} size="cover" />

      {thumbnailImageUrl ? (
        <Image src={thumbnailImageUrl} onClick={() => thumbnailDialogRef.current?.open()} />
      ) : (
        <ImagePlaceholder onClick={() => thumbnailDialogRef.current?.open()} />
      )}
      {coverImageUrl ? (
        <Image src={coverImageUrl} onClick={() => coverDialogRef.current?.open()} />
      ) : (
        <ImagePlaceholder onClick={() => coverDialogRef.current?.open()} />
      )}

      <ImageCropDialog imageType="avatar" onConfirm={handleAvatarConfirm} ref={avatarDialogRef} />
      <ImageCropDialog imageType="videoThumbnail" onConfirm={handleThumbnailConfirm} ref={thumbnailDialogRef} />
      <ImageCropDialog imageType="cover" onConfirm={handleCoverConfirm} ref={coverDialogRef} />
    </div>
  )
}
export const Regular = RegularTemplate.bind({})

const ImagePlaceholder = styled(Placeholder)`
  width: 600px;
  min-height: 200px;
  cursor: pointer;
`

const Image = styled.img`
  width: 600px;
  cursor: pointer;
`
